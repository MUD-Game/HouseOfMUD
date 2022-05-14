import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { Room } from "../../../data/interfaces/room";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, dmActionDescriptions, dungeonMasterSendMessages, errorMessages, helpMessagesForDM, parseResponseString, triggers } from "../actions/action-resources";


export class RemoveItem extends Action { //test me

    constructor(dungeonController: DungeonController) {
        super(triggers.removeItem, dungeonController);
    }

    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let recipientCharacterName: string = args[0]
        let nameOfItemToDiscard: string = args[1]
        try {
            let recipientCharacter: Character = dungeon.getCharacter(recipientCharacterName)
            let roomId: string = recipientCharacter.getPosition()
            let room: Room = dungeon.getRoom(roomId)
            let roomName: string = room.getName()
            let characterInventory: ItemInfo[] = recipientCharacter.getInventory()
            try {
                let itemToDiscard: Item = dungeon.getItemByName(nameOfItemToDiscard)
                let idOfItemToDiscard: string = itemToDiscard.getId()
                if (characterInventory.some(it => it.item == idOfItemToDiscard)) {
                    let itemInInventory: ItemInfo = characterInventory.filter(it => it.item == idOfItemToDiscard)[0]
                    if (itemInInventory.count > 1){
                        itemInInventory.count -= 1
                    } else {
                        let indexOfItemToDiscardInInventory: number = characterInventory.indexOf(itemInInventory)
                        characterInventory.splice(indexOfItemToDiscardInInventory, 1)
                    }
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(dungeonMasterSendMessages.itemRemoved, nameOfItemToDiscard, recipientCharacterName), room: roomName})
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacterName, "message", {message: parseResponseString(dungeonMasterSendMessages.removeItem, nameOfItemToDiscard)})
                    this.dungeonController.sendInventoryData(recipientCharacterName)

                } else {
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(errorMessages.charakterHasntItem, recipientCharacterName)})
                }

            } catch(e) {
                //console.log(e)
                let availableItemsString: string = '';
                Object.values(dungeon.items).forEach(item => {
                    let itemName: string = item.getName()
                    availableItemsString += `\n\t${itemName}`
                })
                this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(helpMessagesForDM.itemDoesNotExist, availableItemsString) + dmActionDescriptions.removeItem})
            }

        } catch(e) {
            this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(helpMessagesForDM.characterDoesNotExist, recipientCharacterName) + dmActionDescriptions.removeItem})
        }
        
    }

}