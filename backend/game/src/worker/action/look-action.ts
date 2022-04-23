import { Character, Dungeon, Room } from "../../dungeon/dungeon";
import { Action } from "./action";
import { DungeonController } from "../dungeon-controller"
export class LookAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = "umschauen";
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
        // let senderCharacter: Character = this.dungeonController.getDungeon().getCharacter(user)
        // let currentRoom: Room = senderCharacter.getPosition()
        // let roomName: string = currentRoom.getName()
        // let roomDescription: string = currentRoom.getDescription()
        // let description: string = `Du befindest dich im Raum ${roomName}: ${roomDescription}. Du schaust dich um.`
    }
}