import { ItemInfo } from "../../../data/datasets/itemInfo";
import { ActionElement } from "../../../data/interfaces/actionElement";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { Npc } from "../../../data/interfaces/npc";
import { Room } from "../../../data/interfaces/room";
import { DungeonController, DUNGEONMASTER } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, errorMessages, parseResponseString } from "./action-resources";

export class LookAction extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.look, dungeonController);
    }

    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let roomId: string = senderCharacter.getPosition()
        let room: Room = dungeon.getRoom(roomId)
        let roomName: string = room.getName()
        let roomDescription: string = room.getDescription()
        let description: string = parseResponseString(actionMessages.lookRoom, roomName, roomDescription)
        let roomItems: ItemInfo[] = room.getItemInfos()
        let itemString: string = actionMessages.lookItems
        if (roomItems.length === 0) {
            itemString += actionMessages.lookEmpty
        } else {
            try {
                roomItems.forEach(itemInfo => {
                    let item: Item = dungeon.getItem(itemInfo.item)
                    let itemName: string = item.getName()
                    let itemCount: number = itemInfo.count
                    itemString += `\n\t${itemName} (${itemCount}x)`
                })
            } catch(e) {
                //console.log(e)
                itemString += errorMessages.lookError
            }
        }
        itemString += ". "
        description += itemString

        let roomNpcs: string[] = room.getNpcs()
        let npcString: string = actionMessages.lookNpcs
        if (roomNpcs.length === 0) {
            npcString += actionMessages.lookEmpty
        } else {
            try {
                roomNpcs.forEach(npcId => {
                    let npc: Npc = dungeon.getNpc(npcId)
                    let npcName: string = npc.getName()
                    npcString += `\n\t${npcName}`
                })
            } catch(e) {
                //console.log(e)
                npcString += errorMessages.lookError
            }
        }
        npcString += ". "
        description += npcString

        // Refactorn, anliegende Raume ohne exceptions pruefen
        try {
            let northRoom: Room = dungeon.getNorthernRoom(room)
            let northRoomString: string = `${actionMessages.lookNorth}\n\t${northRoom.getName()}. `
            description += northRoomString
        } catch(e) {
            //console.log(e)
        }

        try {
            let eastRoom: Room = dungeon.getEasternRoom(room)
            let eastRoomString: string = `${actionMessages.lookEast}\n\t${eastRoom.getName()}. `
            description += eastRoomString
        } catch(e) {
            //console.log(e)
        }

        try {
            let southRoom: Room = dungeon.getSouthernRoom(room)
            let southRoomString: string = `${actionMessages.lookSouth}\n\t${southRoom.getName()}. `
            description += southRoomString
        } catch(e) {
            //console.log(e)
        }

        try {
            let westRoom: Room = dungeon.getWesternRoom(room)
            let westRoomString: string = `${actionMessages.lookWest}\n\t${westRoom.getName()}. `
            description += westRoomString
        } catch(e) {
            //console.log(e)
        }

        let dungeonCharacters: Character[] = Object.values(dungeon.characters)
        let playersString: string = actionMessages.lookPlayers
        try {
            dungeonCharacters.forEach(character => {
                if (character.getPosition() === roomId) {
                    let characterName: string = character.getName()
                    if(characterName !== DUNGEONMASTER){
                        playersString += `\n\t${characterName}`
                    }
                }
            })
        } catch(e) {
            //console.log(e)
            playersString += errorMessages.lookError
        }
        playersString += ". "
        description += playersString
        this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: description})
    }
}