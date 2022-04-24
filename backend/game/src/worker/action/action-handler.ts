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
import { DungeonController } from "../dungeon-controller";

export interface ActionHandler {
    actions: { [trigger: string]: Action };
    dungeonActions: DungeonAction[];
    unspecifiedAction: UnspecifiedAction;
    processAction(user: string, message: string): any;
}

/**
 * Processes Actions received by the dungeon controller.
 * @category Action Handler
 */
export class ActionHandlerImpl implements ActionHandler {
    actions: { [trigger: string]: Action } = {};
    dungeonActions: DungeonAction[];
    unspecifiedAction: UnspecifiedAction;

    constructor(dungeonController: DungeonController) {
        let actions: Action[] = [new DiscardAction(dungeonController), new InspectAction(dungeonController), new InventoryAction(dungeonController), new LookAction(dungeonController), new MessageAction(dungeonController), new MoveAction(dungeonController), new PickupAction(dungeonController), new PrivateMessageAction(dungeonController)]
        actions.forEach(action => {
            this.actions[action.trigger] = action;
        });
        let dungeon: Dungeon = dungeonController.getDungeon()
        let dungeonActions: DungeonAction[] = [];
        let dungeonActionElements = dungeon.getActions()
        dungeonActionElements.forEach(action => dungeonActions.push(new DungeonAction(action.command, dungeonController)))
        this.dungeonActions = dungeonActions; // TODO: hier für jede spezifische Aktion ein neues DungeonAction Objekt erstellen
        this.unspecifiedAction = new UnspecifiedAction("unspecified", dungeonController)
    }
    /**
     * Based on the received data in the message the ActionHandler performs the action on the corresponding action type. 
     * @param user User that sent the action message.
     * @param message Message data the user sent. Processes the data into arguments.
     */
    processAction(user: string, message: string) {
        let splitMessageString: string[] = message.split(" ")
        let commandString: string = splitMessageString[0];
        let action: Action | undefined;
        if (commandString in this.actions) {
            action = this.actions[commandString];
        } else {
            action = this.dungeonActions.find(action => action.trigger === message)
            if (action === undefined) {
                action = this.unspecifiedAction;
            }
        }
        let actionArguments: string[] = splitMessageString.slice(1)
        action.performAction(user, actionArguments);
        return action;
    }
}