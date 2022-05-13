import { Character } from "../../../data/interfaces/character";
import { Room } from "../../../data/interfaces/room";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, parseResponseString, extras, errorMessages } from "./action-resources";

/**
 * Action that gets performed when user sends a "sag" message.
 */
export class MessageAction extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.message, dungeonController);
    }

    performAction(user: string, args: string[]) {
        if (args.length === 0) {
            this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: errorMessages.noMessage});
        } else {
            let messageBody: string = args.join(' ')
            let senderCharacter: Character = this.dungeonController.getDungeon().getCharacter(user)
            let senderCharacterName: string = senderCharacter.getName()
            let roomId: string = senderCharacter.getPosition()
            let room: Room = this.dungeonController.getDungeon().getRoom(roomId)
            let roomName: string = room.getName()
            let responseMessage: string = parseResponseString(actionMessages.say, roomName, senderCharacterName, messageBody)
            let routingKey = `room.${roomId}`
            this.dungeonController.getAmqpAdapter().sendActionWithRouting(routingKey, "message", {message: responseMessage})
            this.dungeonController.getAmqpAdapter().sendActionToClient(extras.dungeonMasterId, "message", {message: responseMessage, player: senderCharacterName, room: roomName})
        }
        
    }
}