import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages } from "./action-resources";

export class InventoryAction extends Action {
    trigger: string;
    dungeonController: DungeonController

    constructor(dungeonController: DungeonController) {
        super();
        this.trigger = triggers.inventory;
        this.dungeonController = dungeonController;
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let dungeonId: string = dungeon.getId()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let characterInventory: ItemInfo [] = senderCharacter.getInventory()
        let inventoryMessage: string = actionMessages.inventory
        characterInventory.forEach(itemInfo => {
            let item: Item = dungeon.getItem(itemInfo.item)
            let itemName: string = item.getName()
            let itemCount: number = itemInfo.count
            inventoryMessage += ` ${itemName} (${itemCount}x)`
        })
        this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: inventoryMessage}})
    }

}