import { Dungeon } from '../../../interfaces/dungeon';
import { Action } from './action';
import { DiscardAction } from './actions/discard-action';
import { DungeonAction } from './actions/dungeon-action';
import { InspectAction } from './actions/inspect-action';
import { InventoryAction } from './actions/inventory-action';
import { LookAction } from './actions/look-action';
import { MessageAction } from './actions/message-action';
import { MoveAction } from './actions/move-action';
import { PickupAction } from './actions/pickup-action';
import { PrivateMessageAction } from './actions/private-message-action';
import UnspecifiedAction from './actions/unspecified-action';
import { DungeonController } from '../controller/dungeon-controller';

/**
 * Processes Actions received by the dungeon controller.
 * @category Action Handler
 */
export interface ActionHandler {
    /**
     * Predefined Action types to call performAction on.
     */
    actions: { [trigger: string]: Action };

    /**
     * Dungeon specific actions.
     */
    dungeonActions: { [trigger: string]: DungeonAction };

    /**
     * Action that notifies the dungeon master to act.
     */

    unspecifiedAction: UnspecifiedAction;

    /**
     * Based on the received data in the message the ActionHandler performs the action on the corresponding action type.
     * @param user User that sent the action message.
     * @param message Message data the user sent. Processes the data into arguments.
     */
    processAction(user: string, message: string): any;
}

export class ActionHandlerImpl implements ActionHandler {
    actions: { [trigger: string]: Action } = {};
    dungeonActions: { [trigger: string]: DungeonAction } = {};
    unspecifiedAction: UnspecifiedAction;

    /**
     * Creates an instance of ActionHandler with its necessary actions.
     * @param dungeonController Dungeon Controller instance to get dungeon data from.
     */
    constructor(dungeonController: DungeonController) {
        let actions: Action[] = [
            new DiscardAction(dungeonController),
            new InspectAction(dungeonController),
            new InventoryAction(dungeonController),
            new LookAction(dungeonController),
            new MessageAction(dungeonController),
            new MoveAction(dungeonController),
            new PickupAction(dungeonController),
            new PrivateMessageAction(dungeonController),
        ];
        actions.forEach(action => {
            this.actions[action.trigger] = action;
        });
        let dungeon: Dungeon = dungeonController.getDungeon();
        let dungeonActionElements = dungeon.getActions();
        dungeonActionElements.forEach(action => {
            let dungeonAction: DungeonAction = new DungeonAction(action.command, dungeonController)
            this.dungeonActions[dungeonAction.trigger] = dungeonAction
        });
        this.unspecifiedAction = new UnspecifiedAction('unspecified',dungeonController);
    }

    processAction(user: string, message: string) {
        let splitMessageString: string[] = message.split(' ');
        let commandString: string = splitMessageString[0];
        let action: Action | undefined;
        if (commandString in this.actions) {
            action = this.actions[commandString];
        } else {
            action = this.dungeonActions[message]
            if (action === undefined) {
                action = this.unspecifiedAction;
            }
        }
        let actionArguments: string[] = splitMessageString.slice(1);
        action.performAction(user, actionArguments);
        return action;
    }
}
