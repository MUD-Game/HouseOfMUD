import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, errorMessages } from "./action-resources";

export default class UnspecifiedAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.unspecified;
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: errorMessages.actionDoesNotExist}})
    }
}
