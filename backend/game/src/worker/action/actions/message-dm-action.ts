import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, triggers } from "./action-resources";

/**
 * Action that gets performed when user sends a "fluesterdm" message.
 */
 export class MessageMasterAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.messageMaster;
        this.dungeonController = dungeonController;
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let senderCharacterName: string = senderCharacter.getName()
        let messageBody: string = args.join(' ')
        let responseMessage: string = `[privat] ${senderCharacterName} -> ${actionMessages.dmWhisper}: ${messageBody}`
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        amqpAdapter.sendToClient(user, {action: "message", data: {message: responseMessage}})
        amqpAdapter.sendToClient('0', {action: "message", data: {message: responseMessage}})
    }
}