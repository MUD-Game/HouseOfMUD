import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Room } from "../../../data/interfaces/room";
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
        let characterPosition: string = senderCharacter.getPosition()
        let room: Room = dungeon.getRoom(characterPosition)
        let roomName: string = room.getName()
        let messageBody: string = args.join(' ')
        let responseMessage: string = parseResponseString(actionMessages.whisperToDm, senderCharacterName, messageBody)
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        amqpAdapter.sendActionToClient(user, "message", {message: responseMessage})
        amqpAdapter.sendActionToClient(extras.dungeonMasterId, "message", {message: responseMessage, player: senderCharacterName, room: roomName})
    }
}