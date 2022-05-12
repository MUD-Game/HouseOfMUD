import { ActionElement } from "../../../data/interfaces/actionElement";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Room } from "../../../data/interfaces/room";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionDescriptions, actionMessages, errorMessages, triggers } from "./action-resources";

export class ShowActions extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.showActions, dungeonController);
    }

    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let roomId: string = senderCharacter.getPosition()
        let room: Room = dungeon.getRoom(roomId)
        let roomActions: string[] = room.getActions()
        let globalActions: string[] = dungeon.getGlobalActions()
        let actionString: string = actionMessages.showActionsBeginning
        Object.values(actionDescriptions).forEach(description => {
            actionString += description;
        })
        if (roomActions.length === 0 && globalActions.length === 0) {
            actionString += actionMessages.lookEmpty
        } else {
            try {
                roomActions.forEach(actionId => {
                    if (globalActions.includes(actionId)) {
                        return;
                    } else {
                    let action: ActionElement = dungeon.getAction(actionId)
                    let actionCommand: string = action.getCommand()
                    let actionDescription: string = action.getDescription()
                    actionString += `\n\t'${actionCommand}' - ${actionDescription};`
                    }
                })
                globalActions.forEach(actionId => {
                    let action: ActionElement = dungeon.getAction(actionId)
                    let actionCommand: string = action.getCommand()
                    let actionDescription: string = action.getDescription()
                    actionString += `\n\t'${actionCommand}' - ${actionDescription};`
                })
            } catch(e) {
                //console.log(e)
                actionString += errorMessages.lookError
            }
        }
        actionString += actionMessages.showActionsEnding
        this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: actionString })
    }
}