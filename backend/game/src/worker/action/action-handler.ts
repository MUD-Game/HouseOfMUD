import { Dungeon } from '../../data/interfaces/dungeon';
import { DungeonController } from '../controller/dungeon-controller';
import { Action } from './action';
import { extras, triggers } from './actions/action-resources';
import { BroadcastMessageAction } from './actions/broadcast-message-action';
import { DiscardAction } from './actions/discard-action';
import { DungeonAction } from './actions/dungeon-action';
import { InspectAction } from './actions/inspect-action';
import InvalidAction from './actions/invalid-action';
import { InventoryAction } from './actions/inventory-action';
import { LookAction } from './actions/look-action';
import { MessageAction } from './actions/message-action';
import { MessageMasterAction } from './actions/message-dm-action';
import { MoveAction } from './actions/move-action';
import { PickupAction } from './actions/pickup-action';
import { PrivateMessageAction } from './actions/private-message-action';
import UnspecifiedAction from './actions/unspecified-action';


const regExpression = {
    forDungeonMaster: new RegExp("^((fluester )|(broadcast))", "i"),
    predefinedActions: new RegExp(`^((${triggers.message})|(${triggers.whisper})|(${triggers.discard})|(${triggers.inspect})|(${triggers.inventory})|(${triggers.look})|(${triggers.move})|(${triggers.pickup})|(${triggers.unspecified}))`, "i")
}
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
     * Used when user tries to perform an action that does not exist.
     */
    invalidAction: InvalidAction;

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
    invalidAction: InvalidAction;

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
            new BroadcastMessageAction(dungeonController),
            new UnspecifiedAction(dungeonController),
            new MessageMasterAction(dungeonController)
        ];
        actions.forEach(action => {
            this.actions[action.trigger] = action;
        });
        let dungeon: Dungeon = dungeonController.getDungeon();
        let dungeonActionElements = dungeon.getActions();
        dungeonActionElements.forEach(action => {
            let dungeonAction: DungeonAction = new DungeonAction(action.command, dungeonController, action.events)
            this.dungeonActions[dungeonAction.trigger] = dungeonAction
        });
        this.invalidAction = new InvalidAction(dungeonController)
    }

    processAction(user: string, message: string) {
        let action: Action | undefined = undefined;
        if (this.userIsDungeonMaster(user)) {
            if (this.inputMatch(message, regExpression.forDungeonMaster)) {
                action = this.getAction(message)
            } else {
                action = this.invalidAction;
            }
        } else {
            let dungeonActions: DungeonAction[] = Object.values(this.dungeonActions)
            action = dungeonActions.find(dungeonAction => this.inputMatch(message, dungeonAction.regEx))
            if (action === undefined) {
                if (this.inputMatch(message, regExpression.predefinedActions)) {
                    action = this.getAction(message)
                } else {
                    action = this.invalidAction
                }
            }
        }
        let actionArguments: string[] = this.getActionArguments(message)
        action.performAction(user, actionArguments);
        return action;
    }

    /**
     * Checks if user is dungeon master.
     * @param user Character Id of user to check.
     * @returns True if character id of user is 0.
     */
    userIsDungeonMaster(user: string): boolean {
        if (user === extras.dungeonMasterId) {
            return true
        } else {
            return false
        }
    }

    /**
     * Returns command from message string.
     * @param messageString Message string to get command from.
     * @returns First value of message string.
     */
    getAction(messageString: string): Action {
        let splitMessageString: string[] = messageString.split(' ');
        console.log(splitMessageString[0])
        let action: Action = this.actions[splitMessageString[0]]
        return action;
    }

    getActionArguments(messageString: string): string[] {
        let splitMessageString: string[] = messageString.split(' ');
        let actionArguments: string[] = splitMessageString.slice(1);
        return actionArguments;
    }

    /**
     * Checks if message matches with given regular Expression.
     * @param message Message to check.
     * @param regEx Regular expression to check against.
     * @returns True if message matches regular expression.
     */
    inputMatch(message: string, regEx: RegExp): boolean {
        return regEx.test(message)
    }
}
