import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, errorMessages } from "./action-resources";

export default class UnspecifiedAction extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.unspecified, dungeonController);
    }

    performAction(user: string, args: string[]) {
        this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: errorMessages.actionDoesNotExist}})
    }
}
