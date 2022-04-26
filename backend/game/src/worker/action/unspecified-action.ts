import { Dungeon } from "../../dungeon/dungeon";
import { Action } from "./action";
import { DungeonController } from "../dungeon-controller"

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
