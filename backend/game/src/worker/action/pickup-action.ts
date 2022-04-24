import { Dungeon } from "../../dungeon/dungeon";
import { Action } from "./action";
import { DungeonController } from "../dungeon-controller"

export class PickupAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = "aufheben";
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
    }

}