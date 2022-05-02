import { ItemInfo } from "../../../data/datasets/itemInfo";
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
        let characterInventory: ItemInfo[] = senderCharacter.getInventory()
        let idOfCharacterPosition: string = senderCharacter.getPosition()
        let characterPosition: Room = dungeon.getRoom(idOfCharacterPosition)
        let roomItems: ItemInfo[] = characterPosition.getItemInfos()
        try {
            let itemToDiscard: Item = dungeon.getItemByName(nameOfItemToDiscard)
            let idOfItemToDiscard: string = itemToDiscard.getId()
            if (characterInventory.some(it => it.item == idOfItemToDiscard)) {
                let itemInInventory: ItemInfo = characterInventory.filter(it => it.item == idOfItemToDiscard)[0]
                let indexOfItemToDiscardInInventory: number = characterInventory.indexOf(itemInInventory)
                characterInventory.splice(indexOfItemToDiscardInInventory, 1)
                if (itemInInventory.count > 1){
                    itemInInventory.count -= 1
                    characterInventory.push(itemInInventory) 
                }
                if (roomItems.some(it => it.item == idOfItemToDiscard)) {
                    let itemInRoom: ItemInfo = roomItems.filter(it => it.item == idOfItemToDiscard)[0]
                    let indexOfItemToDiscardInRoom: number = roomItems.indexOf(itemInInventory)
                    roomItems.splice(indexOfItemToDiscardInRoom, 1)
                    itemInRoom.count += 1
                    roomItems.push(itemInRoom)
                }
                else{
                    itemInInventory.count = 1
                    roomItems.push(itemInInventory)
                }
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