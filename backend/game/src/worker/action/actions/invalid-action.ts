import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, errorMessages, parseResponseString } from "./action-resources";

export default class InvalidAction extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.invalid, dungeonController);
    }

    performAction(user: string, args: string[]) {
        this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(errorMessages.actionDoesNotExist, triggers.showActions)})
    }
}