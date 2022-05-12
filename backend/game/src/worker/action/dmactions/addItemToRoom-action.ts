import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { Room } from "../../../data/interfaces/room";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, dungeonMasterSendMessages, errorMessages, helpMessagesForDM, parseResponseString, triggers } from "../actions/action-resources";

export class AddRoomItem extends Action { //test me

    constructor(dungeonController: DungeonController) {
        super(triggers.addRoomItem, dungeonController);
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let roomName: string = args[0]
        let nameOfItemToAdd: string = args[1]
        try {
            let room: Room = dungeon.getRoomByName(roomName)
            let roomItems: ItemInfo[] = room.getItemInfos()
            try {
                let itemToAdd: Item = dungeon.getItemByName(nameOfItemToAdd)
                let idOfitemToAdd: string = itemToAdd.getId()
                if (roomItems.some(it => it.item == idOfitemToAdd)) { 
                    let itemInRoom: ItemInfo = roomItems.filter(it => it.item == idOfitemToAdd)[0]
                    itemInRoom.count += 1
                } else {
                    roomItems.push(new ItemInfo(idOfitemToAdd, 1))
                }
                this.dungeonController.getAmqpAdapter().broadcastAction("message", {message: parseResponseString(dungeonMasterSendMessages.itemRoomAdded, roomName, nameOfItemToAdd), room: roomName})

            } catch(e) {
                let availableItemsString: string = '';
                Object.values(dungeon.items).forEach(item => {
                    let itemName: string = item.getName()
                    availableItemsString += `\n\t${itemName}`
                })
                this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(helpMessagesForDM.itemDoesNotExist, availableItemsString), room: roomName})
            }
        
        } catch(e) {
            //console.log(e)
            let availableRoomsString: string = '';
                Object.values(dungeon.rooms).forEach(room => {
                    let roomName: string = room.getName()
                    availableRoomsString += `\n\t${roomName}`
                })
            this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(helpMessagesForDM.roomDoesNotExist, availableRoomsString)})
        }
    }
}