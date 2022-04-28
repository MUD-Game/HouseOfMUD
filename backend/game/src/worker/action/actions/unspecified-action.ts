import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";

export default class UnspecifiedAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(trigger: string, dungeonController: DungeonController) {
        this.trigger = trigger;
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: "Diese Aktion existiert nicht!"}})
    }
}
