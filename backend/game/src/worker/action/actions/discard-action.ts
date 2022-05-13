import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { Room } from "../../../data/interfaces/room";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, errorMessages, extras, parseResponseString, triggers } from "./action-resources";

export class DiscardAction extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.discard, dungeonController);
    }

    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let nameOfItemToDiscard: string = args[0]
        let characterInventory: ItemInfo[] = senderCharacter.getInventory()
        let idOfCharacterPosition: string = senderCharacter.getPosition()
        let characterPosition: Room = dungeon.getRoom(idOfCharacterPosition)
        let roomName: string = characterPosition.getName()
        let roomItems: ItemInfo[] = characterPosition.getItemInfos()
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
                if (roomItems.some(it => it.item == idOfItemToDiscard)) {
                    let itemInRoom: ItemInfo = roomItems.filter(it => it.item == idOfItemToDiscard)[0]
                    itemInRoom.count += 1
                }
                else{
                    roomItems.push(new ItemInfo(itemInInventory.item, 1))
                }
                this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(actionMessages.discard, nameOfItemToDiscard)})
                // message sent to dungeon master
                this.dungeonController.getAmqpAdapter().sendActionToClient(extras.dungeonMasterId, "message", {message: parseResponseString(actionMessages.discardDungeonMaster, user, nameOfItemToDiscard, roomName), player: user, room: roomName})
                this.dungeonController.sendInventoryData(user)
            } else {
                this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(errorMessages.itemNotOwned, triggers.inventory)})
            }
        } catch(e) {
            //console.log(e)
            this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(errorMessages.itemNotOwned, triggers.inventory)})
        }
    }

}