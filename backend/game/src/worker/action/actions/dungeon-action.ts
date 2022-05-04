import { ActionEvent } from "../../../data/interfaces/actionEvent";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";

export class DungeonAction extends Action {
    actionEvents: ActionEvent[]
    regEx: RegExp

    constructor(trigger: string, dungeonController: DungeonController, actionEvents: ActionEvent[]) {
        super(trigger, dungeonController);
        this.actionEvents = actionEvents
        let stringForRegEx: string = `^(${trigger})$`
        this.regEx = new RegExp(stringForRegEx)
    }

    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
    }

}