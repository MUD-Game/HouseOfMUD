import { Character, Dungeon, Room } from "../../dungeon/dungeon";
import { Action } from "./action";

export class LookAction implements Action {
    trigger: string;
    dungeon: Dungeon;

    constructor(dungeon: Dungeon) {
        this.trigger = "umschauen";
        this.dungeon = dungeon
    }
    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
        let senderCharacter: Character = this.dungeon.getCharacter(user)
        let currentRoom: Room = senderCharacter.getPosition()
        let roomName: string = currentRoom.getName()
        let roomDescription: string = currentRoom.getDescription()
        let description: string = `Du befindest dich im Raum ${roomName}: ${roomDescription}. Du schaust dich um.`
    }
}