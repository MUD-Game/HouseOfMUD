import { Dungeon } from "../../dungeon/dungeon";
import { Action } from "./action";

export class InspectAction implements Action {
    trigger: string;
    dungeon: Dungeon;

    constructor(dungeon: Dungeon) {
        this.trigger = "untersuche";
        this.dungeon = dungeon
    }
    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
    }

}