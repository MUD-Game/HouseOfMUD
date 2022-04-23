import { Dungeon } from "../../dungeon/dungeon";
import { Action } from "./action";
import { DungeonController } from "../dungeon-controller"

export default class UnspecifiedAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(trigger: string, dungeonController: DungeonController) {
        this.trigger = trigger;
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
    }
}
