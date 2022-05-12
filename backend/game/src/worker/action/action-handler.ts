import { Dungeon } from '../../data/interfaces/dungeon';
import { DungeonController } from '../controller/dungeon-controller';
import { Action } from './action';
import { extras, triggers } from './actions/action-resources';
import { DieAction } from './actions/die-action';
import { DiscardAction } from './actions/discard-action';
import { DungeonAction } from './actions/dungeon-action';
import { HelpAction } from './actions/help-action';
import { InspectAction } from './actions/inspect-action';
import InvalidAction from './actions/invalid-action';
import { InventoryAction } from './actions/inventory-action';
import { LookAction } from './actions/look-action';
import { MessageAction } from './actions/message-action';
import { MessageMasterAction } from './actions/message-dm-action';
import { MoveAction } from './actions/move-action';
import { PickupAction } from './actions/pickup-action';
import { PrivateMessageAction } from './actions/private-message-action';
import { ShowActions } from './actions/show-actions';
import UnspecifiedAction from './actions/unspecified-action';
import { AddDamage } from './dmactions/addDamage-action';
import { AddHp } from './dmactions/addHp-action';
import { AddMana } from './dmactions/addMana-action';
import { RemoveHp } from './dmactions/removeHp-action';
import { RemoveMana } from './dmactions/removeMana-action';
import { PrivateMessageFromDm } from './dmactions/privateMessage-action';
import { RemoveDamage } from './dmactions/removeDamage-action';
import { BroadcastMessageAction } from './dmactions/broadcast-message-action';
import { ChangeRoom } from './dmactions/changePlayerPosition-action';
import { RemoveItem } from './dmactions/removeItemFromPlayer-action';
import { ToggleConnectionAction } from './dmactions/toggleRoomConnection-action';
import { AddItem } from './dmactions/addItemToPlayer-action';
import { AddRoomItem } from './dmactions/addItemToRoom-action';
import { removeRoomItem } from './dmactions/removeItemFromRoom-action';
import { KickPlayer } from './dmactions/kickPlayer-action';


// const regExpression = {
//     forDungeonMaster: new RegExp("^((fluester )|(broadcast))", "i"),
//     predefinedActions: new RegExp(`^((${triggers.message})|(${triggers.whisper})|(${triggers.discard})|(${triggers.inspect})|(${triggers.inventory})|(${triggers.look})|(${triggers.move})|(${triggers.pickup})|(${triggers.unspecified})|(${triggers.help})|(${triggers.showActions}))`, "i"),
//     dmActions: new RegExp(`^((${triggers.addDamage})|(${triggers.addHp})|(${triggers.addMana})|(${triggers.removeMana})|(${triggers.removeHp})|(${triggers.removeMana})|(${triggers.removeDamage})|(${triggers.broadcast})|(${triggers.whisper})|(${triggers.addItem})|(${triggers.addRoomItem})|(${triggers.removeItem})|(${triggers.removeRoomItem})|(${triggers.changeRoom})|(${triggers.kickPlayer}))`, "i")
// }

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
     * Used when hp of user are less equal 0
     */
    dieAction: DieAction;

    /**
     * Predefined Dungeon Master Actions types to call performAction on.
     */
     dmActions: { [trigger: string]: Action };


    /**
     * Based on the received data in the message the ActionHandler performs the action on the corresponding action type.
     * @param user User that sent the action message.
     * @param message Message data the user sent. Processes the data into arguments.
     */
    processAction(user: string, message: string): any;
    processDmAction(message: string): any;
}

export class ActionHandlerImpl implements ActionHandler {
    actions: { [trigger: string]: Action } = {};
    dungeonActions: { [trigger: string]: DungeonAction } = {};
    invalidAction: InvalidAction;
    dieAction: DieAction;
    dmActions:{ [trigger: string]: Action } = {};

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
            new UnspecifiedAction(dungeonController),
            new MessageMasterAction(dungeonController),
            new HelpAction(dungeonController),
            new ShowActions(dungeonController)
        ];
        actions.forEach(action => {
            this.actions[action.trigger!] = action;
        });
        let dungeon: Dungeon = dungeonController.getDungeon();
        let dungeonActionElements = dungeon.getActions();
        dungeonActionElements.forEach(action => {
            let dungeonAction: DungeonAction = new DungeonAction(action.command, dungeonController, action)
            this.dungeonActions[dungeonAction.trigger] = dungeonAction
        });
        this.invalidAction = new InvalidAction(dungeonController);
        this.dieAction = new DieAction(dungeonController)

        let dmActions: Action[] = [
           new AddDamage(dungeonController),
           new AddHp(dungeonController),
           new AddMana(dungeonController),
           new RemoveMana(dungeonController),
           new RemoveDamage(dungeonController),
           new RemoveHp(dungeonController),
           new PrivateMessageFromDm(dungeonController),
           new BroadcastMessageAction(dungeonController),
           new ChangeRoom(dungeonController),
           new AddItem(dungeonController),
           new RemoveItem(dungeonController),
           new AddRoomItem(dungeonController),
           new removeRoomItem(dungeonController),
           new ToggleConnectionAction(dungeonController),
           new KickPlayer(dungeonController)
        ];
        dmActions.forEach(dmaction => {
            this.dmActions[dmaction.trigger!] = dmaction;
        });

    }

    async processAction(user: string, message: string) {
        let action: Action | undefined = undefined;
        let dungeonActions: DungeonAction[] = Object.values(this.dungeonActions)
        action = dungeonActions.find(dungeonAction => this.inputMatch(message, dungeonAction.regEx))
        if (action === undefined) {
            action = this.getAction(message)
            if (action === undefined) {
                action = this.invalidAction
            }
        }
        let actionArguments: string[] = this.getActionArguments(message)
        try {
            action.performAction(user, actionArguments);
        } catch(e) {
            console.log('Action invalid')
        }
        this.dieAction.performAction(user, [])
        return action;
    }

    processDmAction(message: string) {
        let dmaction: Action | undefined = undefined;
        dmaction = this.getDmAction(message);
        if (dmaction === undefined) {
            dmaction = this.invalidAction
        }
        let actionArguments: string[] = this.getActionArguments(message)
        try {
            dmaction.performAction(extras.dungeonMasterId, actionArguments);
        } catch(e) {
            console.log('Action invalid')
        }
        return dmaction;
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
     * Returns matching action from message string.
     * @param messageString Message string to get command from.
     * @returns Action matching the command.
     */
    getAction(messageString: string): Action {
        let splitMessageString: string[] = messageString.split(' ');
        console.log(splitMessageString[0])
        let action: Action = this.actions[splitMessageString[0]]
        return action;
    }

    /**
     * Returns matching dm action from message string.
     * @param messageString Message string to get command from.
     * @returns Dm action matching the command.
     */
     getDmAction(messageString: string): Action {
        let splitMessageString: string[] = messageString.split(' ');
        console.log(splitMessageString[0])
        let action: Action = this.dmActions[splitMessageString[0]]
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
