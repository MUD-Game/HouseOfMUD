import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";

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