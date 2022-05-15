import { ActionElement } from "../../../data/interfaces/actionElement";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionDescriptions, actionMessages, dungeonMasterSendMessages, dmActionDescriptions, errorMessages, triggers } from "../actions/action-resources";


export class ShowDmActions extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.showDmActions, dungeonController);
    }

    performAction(user: string, args: string[]) {
        
        let actionString: string = dungeonMasterSendMessages.showDmActionsBeginning
        Object.values(dmActionDescriptions).forEach(description => {
            actionString += description;
        })
        
        actionString += dungeonMasterSendMessages.showDmActionsEnding
        this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: actionString })
    }
}