import { Character, Dungeon, Item } from "../../../dungeon/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";

export class InventoryAction implements Action {
    trigger: string;
    dungeonController: DungeonController

    constructor(dungeonController: DungeonController) {
        this.trigger = "inv";
        this.dungeonController = dungeonController;
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let dungeonId: string = dungeon.getId()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let characterInventory: string [] = senderCharacter.getInventory()
        let inventoryMessage: string = "Du hast folgende Items im Inventar:"
        characterInventory.forEach(itemId => {
            let item: Item = dungeon.getItem(itemId)
            let itemName: string = item.getName()
            inventoryMessage += ` ${itemName}`
        })
        this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: inventoryMessage}})
    }

}