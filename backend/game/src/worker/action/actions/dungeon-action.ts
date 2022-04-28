import { DungeonController } from "worker/controller/dungeon-controller";
import { Action } from "../action";

export class DungeonAction implements Action {
    trigger: string;
    dungeonController: DungeonController

    constructor(trigger: string, dungeonController: DungeonController) {
        this.trigger = trigger;
        this.dungeonController = dungeonController
    }

    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
    }

}