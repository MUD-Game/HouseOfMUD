import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { Room } from "../../../data/interfaces/room";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, errorMessages, extras, parseResponseString, triggers } from "./action-resources";

export class PickupAction extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.pickup, dungeonController);
    }
    async performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let nameOfItemToPickup: string = args.join(' ')
        let characterInventory: ItemInfo[] = senderCharacter.getInventory()
        let idOfCharacterPosition: string = senderCharacter.getPosition()
        let characterPosition: Room = dungeon.getRoom(idOfCharacterPosition)
        let roomName: string = characterPosition.getName()
        let roomItems: ItemInfo[] = characterPosition.getItemInfos()
        try {
            let itemToPickup: Item = dungeon.getItemByName(nameOfItemToPickup)
            let idOfitemToPickup: string = itemToPickup.getId()
            if (roomItems.some(it => it.item == idOfitemToPickup)) {
                let itemInRoom: ItemInfo = roomItems.filter(it => it.item == idOfitemToPickup)[0]
                console.log(itemInRoom)
                let indexOfitemToPickupInRoom: number = roomItems.indexOf(itemInRoom)
                roomItems.splice(indexOfitemToPickupInRoom, 1)
                if (itemInRoom.count > 1){
                    itemInRoom.count -= 1
                    console.log(itemInRoom)
                    roomItems.push(itemInRoom) 
                }
                if (characterInventory.some(it => it.item == idOfitemToPickup)) {
                    let itemInInventory: ItemInfo = characterInventory.filter(it => it.item == idOfitemToPickup)[0]
                    itemInInventory.count += 1
                }
                else {
                    characterInventory.push(new ItemInfo(itemInRoom.item, 1))
                }
                await this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(actionMessages.pickup, nameOfItemToPickup)})
                await this.dungeonController.getAmqpAdapter().sendActionToClient(extras.dungeonMasterId, "message", {message: parseResponseString(actionMessages.pickupDungeonMaster, user, nameOfItemToPickup, roomName), player: user, room: roomName})
                await this.dungeonController.sendInventoryData(user)
            } else {
                this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(errorMessages.itemNotInRoom, triggers.pickup)})
            }
        } catch(e) {
            //console.log(e)
            this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(errorMessages.itemNotInRoom, triggers.pickup)})
        }
    }
}