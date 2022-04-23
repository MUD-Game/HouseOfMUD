import { Dungeon } from "../../dungeon/dungeon";
import { Action } from "./action";

export class DungeonAction implements Action {
    trigger: string;
    dungeon: Dungeon;

    constructor(trigger: string, dungeon: Dungeon) {
        this.trigger = trigger;
        this.dungeon = dungeon
    }
    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
    }

}