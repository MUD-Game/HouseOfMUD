import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, extras, parseResponseString, triggers } from "./action-resources";

/**
 * Action that gets performed when user sends a "fluesterdm" message.
 */
 export class MessageMasterAction extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.messageMaster, dungeonController);
    }

    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let senderCharacterName: string = senderCharacter.getName()
        let messageBody: string = args.join(' ')
        let responseMessage: string = parseResponseString(actionMessages.whisperToDm, senderCharacterName, messageBody)
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        amqpAdapter.sendToClient(user, {action: "message", data: {message: responseMessage}})
        amqpAdapter.sendToClient(extras.dungeonMasterId, {action: "message", data: {message: responseMessage, player: senderCharacterName}})
    }
}