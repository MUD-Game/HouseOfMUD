import { Character } from "../../../data/interfaces/character";
import { Room } from "../../../data/interfaces/room";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, parseResponseString, extras } from "./action-resources";

/**
 * Action that gets performed when user sends a "sag" message.
 */
export class MessageAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.message;
        this.dungeonController = dungeonController;
    }
    performAction(user: string, args: string[]) {
        let messageBody: string = args.join(' ')
        let senderCharacter: Character = this.dungeonController.getDungeon().getCharacter(user)
        let senderCharacterName: string = senderCharacter.getName()
        let roomId: string = senderCharacter.getPosition()
        let room: Room = this.dungeonController.getDungeon().getRoom(roomId)
        let roomName: string = room.getName()
        let responseMessage: string = parseResponseString(actionMessages.say, roomName, senderCharacterName, messageBody)
        let routingKey = `room.${roomId}`
        this.dungeonController.getAmqpAdapter().sendWithRouting(routingKey, {action: "message", data: {message: responseMessage}})
        this.dungeonController.getAmqpAdapter().sendToClient(extras.dungeonMasterId, {action: "message", data: {message: responseMessage}})
    }
}