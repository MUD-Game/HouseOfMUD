import { Dungeon } from "../../dungeon/dungeon";
import { Action } from "./action";
import { DungeonController } from "../dungeon-controller"

export class DiscardAction implements Action {
    trigger: string;
    dungeonController: DungeonController

    constructor(dungeonController: DungeonController) {
        this.trigger = "ablegen";
        this.dungeonController = dungeonController;
    }

    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
    }

}