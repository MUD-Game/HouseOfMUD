import { Dungeon } from "../../dungeon/dungeon";
import { Action } from "./action";

export class MoveAction implements Action {
    trigger: string;
    dungeon: Dungeon;

    constructor(dungeon: Dungeon) {
        this.trigger = "gehe";
        this.dungeon = dungeon
    }
    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
    }

}
