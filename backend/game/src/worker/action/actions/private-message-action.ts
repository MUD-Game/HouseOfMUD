import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Room } from "../../../data/interfaces/room";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, errorMessages, parseResponseString, extras } from "./action-resources";

/**
 * Action that gets performed when user sends a "fluester" message.
 */
export class PrivateMessageAction extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.whisper, dungeonController);
    }
    
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let recipientCharacterName: string = args[0]
        args.shift()
        let messageBody: string = args.join(' ')
        try {
            let recipientCharacter: Character = dungeon.getCharacter(recipientCharacterName)
                let senderCharacter: Character = dungeon.getCharacter(user)
                let senderCharacterName: string = senderCharacter.getName()
                let roomId: string = senderCharacter.getPosition()
                let room: Room = dungeon.getRoom(roomId)
                let recipientCharacterRoomId: string = recipientCharacter.getPosition()
                if (recipientCharacterRoomId === room.getId()) {
                    let responseMessage: string = parseResponseString(actionMessages.whisper, senderCharacterName, recipientCharacterName, messageBody)
                    amqpAdapter.sendActionToClient(user, "message", {message: responseMessage})
                    amqpAdapter.sendActionToClient(recipientCharacterName, "message", {message: responseMessage})
                } else {
                    amqpAdapter.sendActionToClient(user, "message", {message: parseResponseString(actionMessages.whisperCharacterNotInSameRoom, recipientCharacterName)})
                }
            
        } catch(e) {
            //console.log(e)
            amqpAdapter.sendActionToClient(user, "message", {message: parseResponseString(errorMessages.characterDoesNotExist, recipientCharacterName, triggers.look)})
        }
    }
}