import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, parseResponseString, triggers } from "./action-resources";

export class HelpAction extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.help, dungeonController);
    }

    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(actionMessages.helpMessage, dungeon.name, triggers.showActions, triggers.look, triggers.help)})
    }
}