import { Dungeon } from "../../dungeon/dungeon";
import { Action } from "./action";

export class DiscardAction implements Action {
    trigger: string;
    dungeon: Dungeon;

    constructor(dungeon: Dungeon) {
        this.trigger = "ablegen";
        this.dungeon = dungeon;
    }

    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
    }

}