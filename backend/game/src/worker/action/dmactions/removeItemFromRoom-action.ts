import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { Room } from "../../../data/interfaces/room";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, dungeonMasterSendMessages, errorMessages, helpMessagesForDM, parseResponseString, triggers } from "../actions/action-resources";

export class removeRoomItem extends Action { //test me

    constructor(dungeonController: DungeonController) {
        super(triggers.removeRoomItem, dungeonController);
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let roomName: string = args[0]
        let nameOfItemToDelete: string = args[1]
        try {
            let room: Room = dungeon.getRoomByName(roomName)
            let roomItems: ItemInfo[] = room.getItemInfos()
            try {
                let itemToDelete: Item = dungeon.getItemByName(nameOfItemToDelete)
                let idOfitemToDelete: string = itemToDelete.getId()
                if (roomItems.some(it => it.item == idOfitemToDelete)) {
                    let itemInRoom: ItemInfo = roomItems.filter(it => it.item == idOfitemToDelete)[0]
                    console.log(itemInRoom)
                    let indexOfitemToDeleteInRoom: number = roomItems.indexOf(itemInRoom)
                    roomItems.splice(indexOfitemToDeleteInRoom, 1)
                    if (itemInRoom.count > 1){
                        itemInRoom.count -= 1
                        console.log(itemInRoom)
                        roomItems.push(itemInRoom) 
                    }
                    this.dungeonController.getAmqpAdapter().broadcastAction("message", {message: parseResponseString(dungeonMasterSendMessages.itemRoomRemoved, roomName, nameOfItemToDelete), room: roomName})
                } else {
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: helpMessagesForDM.itemNotInRoom, room: roomName})
                }

            } catch(e) {
                //console.log(e)
                let availableItemsString: string = '';
                Object.values(dungeon.items).forEach(item => {
                    let itemName: string = item.getName()
                    availableItemsString += `\n\t${itemName}`
                })
                this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(helpMessagesForDM.itemDoesNotExist, availableItemsString), room: roomName})
            }
            
        } catch(e) {
            let availableRoomsString: string = '';
                Object.values(dungeon.rooms).forEach(room => {
                    let roomName: string = room.getName()
                    availableRoomsString += `\n\t${roomName}`
                })
            this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(helpMessagesForDM.roomDoesNotExist, availableRoomsString)})
        }

    }
}