import { ActionEvent } from "../../../data/interfaces/actionEvent";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";

export class DungeonAction implements Action {
    trigger: string;
    dungeonController: DungeonController;
    actionEvents: ActionEvent[]
    regEx: RegExp

    constructor(trigger: string, dungeonController: DungeonController, actionEvents: ActionEvent[]) {
        this.trigger = trigger;
        this.dungeonController = dungeonController
        this.actionEvents = actionEvents
        let stringForRegEx: string = `^(${trigger})$`
        this.regEx = new RegExp(stringForRegEx)
    }

    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
    }

}