import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers } from "./action-resources";

export class BroadcastMessageAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.broadcast;
        this.dungeonController = dungeonController;
    }
    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
    }
}