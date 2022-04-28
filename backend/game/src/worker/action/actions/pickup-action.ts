import { DungeonController } from "worker/controller/dungeon-controller";
import { Action } from "../action";

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