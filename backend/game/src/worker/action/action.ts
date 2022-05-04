import { DungeonController } from "../controller/dungeon-controller"

export class Action {
    /**
     * Chat command to trigger the action.
     */
     trigger: string;
     /**
      * DungeonController which holds the relevant AmqpAdapter and Dungeon data.
      */
     dungeonController: DungeonController;

    constructor(trigger: string, dungeonController: DungeonController) {
        this.trigger = trigger;
        this.dungeonController = dungeonController;
    }
    /**
     * Performs the action based on the given arguments. Overriden by action type.
     * @param user Character of the user that sent the action message.
     * @param args Arguments received by the ActionHandler.
     */
    performAction(user: string, args: string[]): any {}
}













