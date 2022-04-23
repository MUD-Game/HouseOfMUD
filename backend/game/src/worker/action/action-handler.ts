import { ActionElement, Dungeon } from "../../dungeon/dungeon";
import { Action } from "./action";
import { DiscardAction } from "./discard-action";
import { DungeonAction } from "./dungeon-action";
import { InspectAction } from "./inspect-action";
import { InventoryAction } from "./inventory-action";
import { LookAction } from "./look-action";
import { MessageAction } from "./message-action";
import { MoveAction } from "./move-action";
import { PickupAction } from "./pickup-action";
import { PrivateMessageAction } from "./private-message-action";
import UnspecifiedAction from "./unspecified-action";

export interface IActionHandler {
    actions: Action[];
    dungeonActions: DungeonAction[];
    unspecifiedAction: UnspecifiedAction;
    processAction(user: string, message: string): any;
}

/**
 * Processes Actions received by the dungeon controller.
 * @category Action Handler
 */
export class ActionHandler implements IActionHandler {
    actions: Action[]
    dungeonActions: DungeonAction[];
    unspecifiedAction: UnspecifiedAction;

    constructor(dungeon: Dungeon) {
        this.actions = [new DiscardAction(dungeon), new InspectAction(dungeon), new InventoryAction(dungeon), new LookAction(dungeon), new MessageAction(dungeon), new MoveAction(dungeon), new PickupAction(dungeon), new PrivateMessageAction(dungeon)]
        let dungeonActions: DungeonAction[] = [];
        let dungeonActionElements = dungeon.getActions()
        dungeonActionElements.forEach(action => dungeonActions.push(new DungeonAction(action.command, dungeon)))
        this.dungeonActions = dungeonActions; // TODO: hier für jede spezifische Aktion ein neues DungeonAction Objekt erstellen
        this.unspecifiedAction = new UnspecifiedAction("unspecified", dungeon)
    }
    /**
     * Based on the received data in the message the ActionHandler performs the action on the corresponding action type. 
     * @param user User that sent the action message.
     * @param message Message data the user sent. Processes the data into arguments.
     */
    processAction(user: string, message: string) {
        let splitMessageString: string[] = message.split(" ")
        let commandString: string = splitMessageString[0];
        let action;
        action = this.actions.find(action => action.trigger === commandString)
        if (action === undefined) {
            action = this.dungeonActions.find(action => action.trigger === commandString)
            if (action === undefined) {
                action = this.unspecifiedAction;
            }
        }
        let actionArguments: string[] = splitMessageString.slice(1)
        action.performAction(user, actionArguments);
        return action;
    }
}