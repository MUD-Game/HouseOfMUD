import { IAction } from "./action";
import { DiscardAction } from "./discard-action";
import { DungeonAction } from "./dungeon-action";

export interface IActionHandler {
    actions: IAction[]
    processAction(user: string, message: string): any
}

/**
 * Processes Actions received by the dungeon controller.
 */
export class ActionHandler implements IActionHandler {
    actions: IAction[]

    constructor() {
        this.actions = [new DiscardAction("ablegen"), new DungeonAction("dungeon")]
    }
    /**
     * Based on the received data in the message the ActionHandler performs the action on the corresponding action type. 
     * @param user User that sent the action message.
     * @param message Message data the user sent. Processes the data into arguments.
     */
    processAction(user: string, message: string) {
        throw new Error("Method not implemented.");
    }
}