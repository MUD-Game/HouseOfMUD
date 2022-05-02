import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { Room } from "../../../data/interfaces/room";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, errorMessages, parseResponseString, triggers } from "./action-resources";

export class DiscardAction implements Action {
    trigger: string;
    dungeonController: DungeonController

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.discard;
        this.dungeonController = dungeonController;
    }

    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let nameOfItemToDiscard: string = args.join(' ')
        let characterInventory: string[] = senderCharacter.getInventory()
        let idOfCharacterPosition: string = senderCharacter.getPosition()
        let characterPosition: Room = dungeon.getRoom(idOfCharacterPosition)
        let roomItems: string[] = characterPosition.getItems()
        try {
            let itemToDiscard: Item = dungeon.getItemByName(nameOfItemToDiscard)
            let idOfItemToDiscard: string = itemToDiscard.getId()
            if (characterInventory.includes(idOfItemToDiscard)) {
                let indexOfItemToDiscard: number = characterInventory.indexOf(idOfItemToDiscard)
                characterInventory.splice(indexOfItemToDiscard, 1)
                roomItems.push(idOfItemToDiscard)
                this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: parseResponseString(actionMessages.discard, nameOfItemToDiscard)}})
            } else {
                this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: errorMessages.itemNotOwned}})
            }
        } catch(e) {
            console.log(e)
            this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: errorMessages.itemNotOwned}})
        }
    }

}