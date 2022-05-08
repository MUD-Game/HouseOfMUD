import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { Room } from "../../../data/interfaces/room";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, dungeonMasterSendMessages, errorMessages, parseResponseString, triggers } from "../actions/action-resources";


export class AddItem extends Action { //test me

    constructor(dungeonController: DungeonController) {
        super(triggers.addItem, dungeonController);
    }

    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let recipientCharacter: Character = dungeon.getCharacter(args[0])
        let recipientCharacterName: string = args[0]
        args.shift()
        let nameOfItemToAdd: string = args[0]
        let characterInventory: ItemInfo[] = recipientCharacter.getInventory()

        try {
            let itemToAdd: Item = dungeon.getItemByName(nameOfItemToAdd)
            let idOfItemToAdd: string = itemToAdd.getId()
            let itemInRoom: ItemInfo = characterInventory.filter(it => it.item == idOfItemToAdd)[0]
            if (characterInventory.some(it => it.item == idOfItemToAdd)) {
                let itemInInventory: ItemInfo = characterInventory.filter(it => it.item == idOfItemToAdd)[0]
                if (characterInventory.some(it => it.item == idOfItemToAdd)) {
                    itemInInventory.count += 1
                } else {
                    characterInventory.push(new ItemInfo(itemInRoom.item, 1))
                }
                this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(dungeonMasterSendMessages.itemRemoved, recipientCharacterName, nameOfItemToAdd)})
                this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacterName, "message", {message: parseResponseString(dungeonMasterSendMessages.removeItem, nameOfItemToAdd)})
                this.dungeonController.sendInventoryData(recipientCharacterName)

            } else {
                this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(errorMessages.charakterHasntItem, recipientCharacterName)})
            }
        } catch(e) {
            console.log(e)
            this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: errorMessages.itemNotOwned})
        }
    }

}