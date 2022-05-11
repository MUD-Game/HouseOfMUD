import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages } from "./action-resources";

export class InventoryAction extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.inventory, dungeonController);
    }

    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let characterInventory: ItemInfo [] = senderCharacter.getInventory()
        let inventoryMessage: string = actionMessages.inventory
        characterInventory.forEach(itemInfo => {
            let item: Item = dungeon.getItem(itemInfo.item)
            let itemName: string = item.getName()
            let itemCount: number = itemInfo.count
            inventoryMessage += `\n\t${itemName} (${itemCount}x)`
        })
        this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: inventoryMessage})
    }

}