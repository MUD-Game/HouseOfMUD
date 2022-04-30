import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Room } from "../../../data/interfaces/room";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, errorMessages } from "./action-resources";

/**
 * Action that gets performed when user sends a "fluester" message.
 */
export class PrivateMessageAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.whisper;
        this.dungeonController = dungeonController
    }
    
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let recipientCharacterName: string = args[0]
        args.shift()
        let messageBody: string = args.join(' ')
        try {
            let recipientCharacter: Character = dungeon.getCharacterByName(recipientCharacterName)
            let recipientCharacterId: string = recipientCharacter.getId()
            if (user === '0') {
                let responseMessage: string = `[privat] ${actionMessages.dmWhisper} -> ${recipientCharacterName}: ${messageBody}`
                amqpAdapter.sendToClient(user, {action: "message", data: {message: responseMessage}})
                amqpAdapter.sendToClient(recipientCharacterId, {action: "message", data: {message: responseMessage}})
            } else {
                let senderCharacter: Character = dungeon.getCharacter(user)
                let senderCharacterName: string = senderCharacter.getName()
                let roomId: string = senderCharacter.getPosition()
                let room: Room = dungeon.getRoom(roomId)
                let recipientCharacter: Character = dungeon.getCharacterByName(recipientCharacterName)
                let recipientCharacterRoomId: string = recipientCharacter.getPosition()
                if (recipientCharacterRoomId === room.getId()) {
                    let responseMessage: string = `[privat] ${senderCharacterName} -> ${recipientCharacterName}: ${messageBody}`
                    amqpAdapter.sendToClient(user, {action: "message", data: {message: responseMessage}})
                    amqpAdapter.sendToClient(recipientCharacterId, {action: "message", data: {message: responseMessage}})
                } else {
                    amqpAdapter.sendToClient(user, {action: "message", data: {message: `${recipientCharacterName} ${actionMessages.whisperCharacterNotInSameRoom}`}})
                }
            }
        } catch(e) {
            console.log(e)
            amqpAdapter.sendToClient(user, {action: "message", data: {message: `${errorMessages.characterDoesNotExist1} ${recipientCharacterName} ${errorMessages.characterDoesNotExist2}`}})
        }
    }
}