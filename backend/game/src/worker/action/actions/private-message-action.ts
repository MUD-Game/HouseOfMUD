import { Character } from "src/data/interfaces/character";
import { Dungeon } from "src/data/interfaces/dungeon";
import { Room } from "src/data/interfaces/room";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";

/**
 * Action that gets performed when user sends a "fluester" message.
 */
export class PrivateMessageAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = "fluester";
        this.dungeonController = dungeonController
    }
    
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let senderCharacterName: string = senderCharacter.getName()
        let senderCharacterId: string = senderCharacter.getId()
        let dungeonId: string = dungeon.getId()
        let roomId: string = senderCharacter.getPosition()
        let room: Room = dungeon.getRoom(roomId)
        let recipientCharacterName: string = args[0]
        try {
            let recipientCharacter: Character = dungeon.getCharacterByName(recipientCharacterName)
            let recipientCharacterRoomId: string = recipientCharacter.getPosition()
            let recipientCharacterId: string = recipientCharacter.getId()
            if (recipientCharacterRoomId === room.getId()) {
                args.shift()
                let messageBody: string = args.join(' ')
                let responseMessage: string = `[privat] ${senderCharacterName} -> ${recipientCharacterName}: ${messageBody}`
                amqpAdapter.sendToClient(user, {action: "message", data: {message: responseMessage}})
                amqpAdapter.sendToClient(recipientCharacterId, {action: "message", data: {message: responseMessage}})
            } else {
                amqpAdapter.sendToClient(user, {action: "message", data: {message: `${recipientCharacterName} ist nicht in diesem Raum!`}})
            }
        } catch(e) {
            console.log(e)
            amqpAdapter.sendToClient(user, {action: "message", data: {message: `Der Charakter ${recipientCharacterName} existiert nicht in diesem Dungeon!`}})
        }
        
    }
}