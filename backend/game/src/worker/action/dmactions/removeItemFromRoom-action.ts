import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { Room } from "../../../data/interfaces/room";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, dungeonMasterSendMessages, errorMessages, parseResponseString, triggers } from "../actions/action-resources";

export class removeRoomItem extends Action { //test me

    constructor(dungeonController: DungeonController) {
        super(triggers.removeRoomItem, dungeonController);
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let roomName: string = args[0]

        let room: Room = dungeon.getRoomByName(args[0])
        args.shift()
        let nameOfItemToDelete: string = args[0]
    
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
                this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: parseResponseString(dungeonMasterSendMessages.itemRoomRemoved, roomName, nameOfItemToDelete) }})
            } else {
                this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: errorMessages.itemNotInRoom}})
            }
        } catch(e) {
            console.log(e)
            this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: errorMessages.itemNotInRoom}})
        }
    }
}