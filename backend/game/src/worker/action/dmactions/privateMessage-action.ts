import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Room } from "../../../data/interfaces/room";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, dungeonMasterSendMessages, errorMessages, parseResponseString, triggers } from "../actions/action-resources";


/**
 * Action that gets performed when dungeonmaster sends a "fluester" message.
 */
export class PrivateMessageFromDm extends Action {

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
       
            let responseMessage: string = parseResponseString(dungeonMasterSendMessages.dmWhisper, recipientCharacterName, messageBody)
            amqpAdapter.sendToClient(user, {action: "message", data: {message: responseMessage}})
            amqpAdapter.sendToClient(recipientCharacterName, {action: "message", data: {message: responseMessage}})
            
        } catch(e) {
            console.log(e)
            amqpAdapter.sendToClient(user, {action: "message", data: {message: parseResponseString(errorMessages.characterDoesNotExist, recipientCharacterName)}})
        }
    }
}