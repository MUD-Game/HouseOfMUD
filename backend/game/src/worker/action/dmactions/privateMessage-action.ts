import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Room } from "../../../data/interfaces/room";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, dungeonMasterSendMessages, errorMessages, helpMessagesForDM, parseResponseString, triggers } from "../actions/action-resources";


/**
 * Action that gets performed when dungeonmaster sends a "fluester" message.
 */
export class PrivateMessageFromDm extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.whisper, dungeonController);
    }
    
    performAction(user: string, args: string[]) {
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let recipientCharacterName: string = args[0]
        args.shift()
        let messageBody: string = args.join(' ')
        try {
            let character: Character = dungeon.getCharacter(recipientCharacterName)
            let roomId: string = character.getPosition()
            let room: Room = dungeon.getRoom(roomId)
            let roomName: string = room.getName()
            let responseMessage: string = parseResponseString(dungeonMasterSendMessages.dmWhisper, recipientCharacterName, messageBody)
            amqpAdapter.sendActionToClient(user, "message", {message: responseMessage, room: roomName})
            amqpAdapter.sendActionToClient(recipientCharacterName, "message", {message: responseMessage})
            
        } catch(e) {
            //console.log(e)
            this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(helpMessagesForDM.characterDoesNotExist, recipientCharacterName)})
        }
    }
}