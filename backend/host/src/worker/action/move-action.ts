import { Character, Dungeon, Room } from "../../dungeon/dungeon";
import { amqpAdapter } from "../dungeon-controller";
import { Action } from "./action";

export class MoveAction implements Action {
    trigger: string;
    dungeon: Dungeon;

    constructor(dungeon: Dungeon) {
        this.trigger = "gehe";
        this.dungeon = dungeon
    }
    performAction(user: string, args: string[]) {
        let direction: string = args[0]
        switch(direction) {
            case "Norden":
                break;
            case "Osten":
                break;
            case "Sueden":
                break;
            case "Westen":
                break;
        }
        let senderCharacter: Character = this.dungeon.getCharacter(user)
        let senderCharacterName: string = senderCharacter.getName()
        let senderCharacterPreviousPosition: Room = senderCharacter.getPosition()
        let previousRoomId: string = senderCharacterPreviousPosition.getId()
        amqpAdapter.unbindClientQueue(user, previousRoomId)
    }

}
