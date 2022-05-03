import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";

export class DungeonAction extends Action {
    trigger: string;
    dungeonController: DungeonController
    regEx: RegExp

    constructor(trigger: string, dungeonController: DungeonController) {
        super();
        this.trigger = trigger;
        this.dungeonController = dungeonController
        let stringForRegEx: string = `^(${trigger})`
        this.regEx = new RegExp(stringForRegEx)
    }

    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
    }

}