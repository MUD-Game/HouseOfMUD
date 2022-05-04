import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages } from "./action-resources";

export class DieAction extends Action {

    constructor(dungeonController: DungeonController) {
        super("", dungeonController)
    }

    async performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let characterToDie: Character = dungeon.getCharacter(user)
        let currentPosition: string = characterToDie.getPosition()
        let inventoryItems: ItemInfo[] = characterToDie.getInventory()

        //remove items from inventory and add them to the current room
        let roomItems: ItemInfo[] = dungeon.getRoom(currentPosition).items
        
        inventoryItems.forEach(item => {
            //add the item to the room or increment cound
            if (roomItems.some(it => it.item == item.item)) {
                let itemInRoom: ItemInfo = roomItems.filter(it => it.item == item.item)[0]
                itemInRoom.count += item.count
            }
            else{
                roomItems.push(item)
            }
            //remove item from inventory or decrement count
            let itemInInventory: ItemInfo = inventoryItems.filter(it => it.item == item.item)[0]
            if (itemInInventory.count > 1){
                itemInInventory.count -= 1
            }
            else {
                let indexOfItemToDiscardInInventory: number = inventoryItems.indexOf(itemInInventory)
                inventoryItems.splice(indexOfItemToDiscardInInventory, 1)
            }
        })
        //set position to start room
        characterToDie.modifyPosition("0,0")

        const amqpAdapter = this.dungeonController.getAmqpAdapter()
        //reset the stats to start amount
        characterToDie.currentStats = characterToDie.maxStats
        await amqpAdapter.sendToClient(user, {
            action: 'minimap.move',
            data: "0,0"
        });
        this.dungeonController.sendInventoryData(user)
        this.dungeonController.sendStatsData(user)
        const description = actionMessages.die
        amqpAdapter.sendActionToClient(user, "message", {message: description})
    }
}