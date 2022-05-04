import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";

export class DieAction extends Action {

    constructor(dungeonController: DungeonController) {
        super("", dungeonController)
    }

    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let characterToDie: Character = dungeon.getCharacter(user)
        let currentPosition: string = characterToDie.getPosition()
        let inventoryItems: ItemInfo[] = characterToDie.getInventory()

        //remove items from inventory and add them to the current room
        let roomItems: ItemInfo[] = dungeon.getRoom(currentPosition).items
        let characterInventory: ItemInfo[] = characterToDie.getInventory()
        
        inventoryItems.forEach(item => {
            if (roomItems.some(it => it.item == item.item)) {
                let itemInRoom: ItemInfo = roomItems.filter(it => it.item == item.item)[0]
                itemInRoom.count += item.count
            }
            else{
                roomItems.push(item)
            }
            let itemInInventory: ItemInfo = characterInventory.filter(it => it.item == item.item)[0]
            if (itemInInventory.count > 1){
                itemInInventory.count -= 1
            }
        })
        //set position to start room
        characterToDie.modifyPosition("0,0")

        //reset the stats to start amount
        characterToDie.currentStats = characterToDie.maxStats
    }
}