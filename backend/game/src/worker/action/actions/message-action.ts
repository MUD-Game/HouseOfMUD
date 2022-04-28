import { Character, Room } from "../../../../interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";

/**
 * Action that gets performed when user sends a "sag" message.
 */
export class MessageAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = "sag";
        this.dungeonController = dungeonController;
    }
    performAction(user: string, args: string[]) {
        let messageBody: string = args.join(' ')
        let senderCharacter: Character = this.dungeonController.getDungeon().getCharacter(user)
        let senderCharacterName: string = senderCharacter.getName()
        let roomId: string = senderCharacter.getPosition()
        let room: Room = this.dungeonController.getDungeon().getRoom(roomId)
        let roomName: string = room.getName()
        let dungeonId: string = this.dungeonController.getDungeon().getId()
        let responseMessage: string = `[${roomName}] ${senderCharacterName} sagt ${messageBody}`
        let routingKey = `room.${roomId}`
        this.dungeonController.getAmqpAdapter().sendWithRouting(routingKey, {action: "message", data: {message: responseMessage}})
    }
}