import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, errorMessages, triggers } from "./action-resources";

export class InspectAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.inspect;
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let dungeonId: string = dungeon.getId()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let characterInventory: ItemInfo [] = senderCharacter.getInventory()
        let itemToInspect: string = args[0]
        let userHasItem: boolean = false;
        let inspectMessage: string = ''
        characterInventory.forEach(itemInfo => {
            let item: Item = dungeon.getItem(itemInfo.item)
            let itemName: string = item.getName()
            let itemCount: number = itemInfo.count
            if (itemName === itemToInspect) {
                userHasItem = true
                let itemDescription: string = item.getDescription()
                inspectMessage = `${actionMessages.inspect} ${itemName} (${itemCount}x): ${itemDescription}`
            }
        })
        if (userHasItem) {
            this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: inspectMessage}})
        } else {
            this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: errorMessages.itemNotOwned}})
        }
    }
}