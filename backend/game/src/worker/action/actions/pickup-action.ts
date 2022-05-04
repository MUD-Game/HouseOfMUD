import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { Room } from "../../../data/interfaces/room";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, errorMessages, parseResponseString, triggers } from "./action-resources";

export class PickupAction extends Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        super();
        this.trigger = triggers.pickup;
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let nameOfItemToPickup: string = args.join(' ')
        let characterInventory: ItemInfo[] = senderCharacter.getInventory()
        let idOfCharacterPosition: string = senderCharacter.getPosition()
        let characterPosition: Room = dungeon.getRoom(idOfCharacterPosition)
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
                    let indexOfitemToPickupInInventory: number = roomItems.indexOf(itemInInventory)
                    //characterInventory.splice(indexOfitemToPickupInInventory, 1)
                    itemInInventory.count += 1
                    //characterInventory.push(itemInInventory)
                    this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: parseResponseString(actionMessages.pickup, nameOfItemToPickup)}})
                }
                else{
                    characterInventory.push(new ItemInfo(itemInRoom.item, 1))
                    this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: parseResponseString(actionMessages.pickup, nameOfItemToPickup)}})
                }
                this.dungeonController.sendInventoryData(user)
            } else {
                this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: errorMessages.itemNotInRoom}})
            }
        } catch(e) {
            console.log(e)
            this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: errorMessages.itemNotInRoom}})
        }
    }
}