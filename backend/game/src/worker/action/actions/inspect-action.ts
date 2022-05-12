import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, errorMessages, parseResponseString, triggers } from "./action-resources";

export class InspectAction extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.inspect, dungeonController);
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let characterInventory: ItemInfo[] = senderCharacter.getInventory()
        let itemToInspect: string = args.join(' ')
        let userHasItem: boolean = false;
        let inspectMessage: string = ''
        characterInventory.forEach(itemInfo => {
            let item: Item = dungeon.getItem(itemInfo.item)
            let itemName: string = item.getName()
            let itemCount: number = itemInfo.count
            if (itemName === itemToInspect) {
                userHasItem = true
                let itemDescription: string = item.getDescription()
                // inspectMessage = `${actionMessages.inspect} ${itemName} (${itemCount}x): ${itemDescription}`
                inspectMessage = parseResponseString(actionMessages.inspect, itemToInspect, itemDescription)
            }
        })
        if (userHasItem) {
            this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: inspectMessage})
        } else {
            this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(errorMessages.itemNotOwned, triggers.inventory)})
        }
    }
}