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

    async performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let recipientCharacter: Character = dungeon.getCharacter(args[0])
        let recipientCharacterName: string = args[0]
        args.shift()
        let nameOfItemToAdd: string = args.join(' ')
        let characterInventory: ItemInfo[] = recipientCharacter.getInventory()
        try {
            let itemToAdd: Item = dungeon.getItemByName(nameOfItemToAdd)
            let idOfItemToAdd: string = itemToAdd.getId()
            let itemInInventory: ItemInfo = characterInventory.filter(it => it.item == idOfItemToAdd)[0]
            if (characterInventory.some(it => it.item == idOfItemToAdd)) {
                itemInInventory.count += 1
            } else {
                characterInventory.push(new ItemInfo(idOfItemToAdd, 1))
                console.log(characterInventory)
            }
            await this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(dungeonMasterSendMessages.itemAdded, nameOfItemToAdd, recipientCharacterName)})
            await this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacterName, "message", {message: parseResponseString(dungeonMasterSendMessages.addItem, nameOfItemToAdd)})
            await this.dungeonController.sendInventoryData(recipientCharacterName)
        } catch(e) {
            console.log(e)
            this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: errorMessages.itemDoesntexist})
        }
    }

}