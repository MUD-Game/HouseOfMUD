import { ItemInfo } from "../../../data/datasets/itemInfo";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, extras, parseResponseString } from "./action-resources";

export class DieAction extends Action {

    constructor(dungeonController: DungeonController) {
        super("", dungeonController)
    }

    async performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let characterToDie: Character = dungeon.getCharacter(user)
        if (!characterToDie.isDead()){
            return;
        }
        let currentPosition: string = characterToDie.getPosition()
        let roomName: string = dungeon.getRoom(currentPosition).name
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
        characterToDie.currentStats.hp = characterToDie.maxStats.hp
        characterToDie.currentStats.mana = characterToDie.maxStats.mana
        characterToDie.currentStats.dmg = characterToDie.maxStats.dmg
        await amqpAdapter.sendActionToClient(user, 'minimap.move', "0,0");
        this.dungeonController.sendInventoryData(user)
        this.dungeonController.sendStatsData(user)
        const description = actionMessages.die
        await amqpAdapter.sendActionToClient(user, "message", {message: description})
        // message send to dungeon master
        await amqpAdapter.sendActionToClient(extras.dungeonMasterId, "message", {message: parseResponseString(actionMessages.dieDungeonMaster, user, roomName), player: user, room: roomName});

        // send Playerinformation to DM if player dies and DM views its PlayerData
        if (this.dungeonController.getSelectedPlayer() === user) {
            await this.dungeonController.sendPlayerInformationData();
        }
    }
}