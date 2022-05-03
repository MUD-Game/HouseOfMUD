import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";

export class DieAction implements Action {
    trigger: string;
    dungeonController: DungeonController
    regEx: RegExp

    constructor(trigger: string, dungeonController: DungeonController) {
        this.trigger = "";
        this.dungeonController = dungeonController
        let stringForRegEx: string = `^(${trigger})`
        this.regEx = new RegExp(stringForRegEx)
    }

    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let characterToDie: Character = dungeon.getCharacter(user)
        let currentPosition: string = characterToDie.getPosition()
        let inventoryItems: ItemInfo[] = characterToDie.getInventory()

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
        characterToDie.modifyPosition("0,0")
    }
}