import { Character, Dungeon, Room } from "../../dungeon/dungeon";
import { amqpAdapter } from "../dungeon-controller";
import { Action } from "./action";

/**
 * Action that gets performed when user sends a "sag" message.
 */
export class MessageAction implements Action {
    trigger: string;
    dungeon: Dungeon;

    constructor(dungeon: Dungeon) {
        this.trigger = "sag";
        this.dungeon = dungeon;
    }
    performAction(user: string, args: string[]) {
        let messageBody: string = args.join(' ')
        let senderCharacter: Character = this.dungeon.getCharacter(user)
        let senderCharacterName: string = senderCharacter.getName()
        let room: Room = senderCharacter.getPosition()
        let roomName: string = room.getName()
        let roomId: string = room.getId()
        let dungeonId: string = this.dungeon.getId()
        let routingKey = `${dungeonId}.room.${roomId}`
        let responseMessage: string = `[${roomName}] ${senderCharacterName} sagt ${messageBody}`
        amqpAdapter.sendWithRouting(routingKey, {action: "message", data: {message: responseMessage}})
    }
}