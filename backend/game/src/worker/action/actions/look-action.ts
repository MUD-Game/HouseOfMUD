import { ActionElement, Character, Dungeon, Item, Npc, Room } from "../../../../interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";

export class LookAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = "umschauen";
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let dungeonId: string = dungeon.getId()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let senderCharacterId: string = senderCharacter.getId()
        let roomId: string = senderCharacter.getPosition()
        let room: Room = dungeon.getRoom(roomId)
        let roomName: string = room.getName()
        let roomDescription: string = room.getDescription()
        let description: string = `Du befindest dich im Raum ${roomName}: ${roomDescription}. Du schaust dich um. `

        let roomItems: string[] = room.getItems()
        let itemString: string = `Es liegen folgende Items in dem Raum:`
        roomItems.forEach(itemId => {
            let item: Item = dungeon.getItem(itemId)
            let itemName: string = item.getName()
            itemString += ` ${itemName}`
        })
        itemString += ". "
        description += itemString

        let roomNpcs: string[] = room.getNpcs()
        let npcString: string = `Folgende NPCs sind in diesem Raum:`
        roomNpcs.forEach(npcId => {
            let npc: Npc = dungeon.getNpc(npcId)
            let npcName: string = npc.getName()
            npcString += ` ${npcName}`
        })
        npcString += ". "
        description += npcString

        try {
            let northRoom: Room = dungeon.getNorthernRoom(room)
            let northRoomString: string = `Im Norden befindet sich folgender Raum: ${northRoom.getName()}. `
            description += northRoomString
        } catch(e) {
            console.log(e)
        }

        try {
            let eastRoom: Room = dungeon.getEasternRoom(room)
            let eastRoomString: string = `Im Osten befindet sich folgender Raum: ${eastRoom.getName()}. `
            description += eastRoomString
        } catch(e) {
            console.log(e)
        }

        try {
            let southRoom: Room = dungeon.getSouthernRoom(room)
            let southRoomString: string = `Im Sueden befindet sich folgender Raum: ${southRoom.getName()}. `
            description += southRoomString
        } catch(e) {
            console.log(e)
        }

        try {
            let westRoom: Room = dungeon.getWesternRoom(room)
            let westRoomString: string = `Im Westen befindet sich folgender Raum: ${westRoom.getName()}. `
            description += westRoomString
        } catch(e) {
            console.log(e)
        }

        let roomActions: string[] = room.getActions()
        let actionString: string = `Du kannst in diesem Raum folgende Aktionen ausfuehren:`
        roomActions.forEach(actionId => {
            let action: ActionElement = dungeon.getAction(actionId)
            let actionCommand: string = action.getCommand()
            actionString += ` ${actionCommand}`
        })
        actionString += ". "
        description += actionString
        this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: description}})
    }
}