import { Dungeon } from "../../dungeon/dungeon";
import { Action } from "./action";

export default class UnspecifiedAction implements Action {
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
