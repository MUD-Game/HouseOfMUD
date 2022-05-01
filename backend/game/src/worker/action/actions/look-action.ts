import { ActionElement } from "../../../data/interfaces/actionElement";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { Npc } from "../../../data/interfaces/npc";
import { Room } from "../../../data/interfaces/room";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, errorMessages } from "./action-resources";

export class LookAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.look;
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let dungeonId: string = dungeon.getId()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let roomId: string = senderCharacter.getPosition()
        let room: Room = dungeon.getRoom(roomId)
        let roomName: string = room.getName()
        let roomDescription: string = room.getDescription()
        let description: string = `${actionMessages.lookRoom} ${roomName}: ${roomDescription}. ${actionMessages.lookAround} `

        let roomItems: string[] = room.getItems()
        let itemString: string = actionMessages.lookItems
        if (roomItems.length === 0) {
            itemString += actionMessages.lookEmpty
        } else {
            try {
                roomItems.forEach(itemId => {
                    let item: Item = dungeon.getItem(itemId)
                    let itemName: string = item.getName()
                    itemString += ` ${itemName}`
                })
            } catch(e) {
                console.log(e)
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
                    npcString += ` ${npcName}`
                })
            } catch(e) {
                console.log(e)
                npcString += errorMessages.lookError
            }
        }
        npcString += ". "
        description += npcString

        try {
            let northRoom: Room = dungeon.getNorthernRoom(room)
            let northRoomString: string = `${actionMessages.lookNorth} ${northRoom.getName()}. `
            description += northRoomString
        } catch(e) {
            console.log(e)
        }

        try {
            let eastRoom: Room = dungeon.getEasternRoom(room)
            let eastRoomString: string = `${actionMessages.lookEast} ${eastRoom.getName()}. `
            description += eastRoomString
        } catch(e) {
            console.log(e)
        }

        try {
            let southRoom: Room = dungeon.getSouthernRoom(room)
            let southRoomString: string = `${actionMessages.lookSouth} ${southRoom.getName()}. `
            description += southRoomString
        } catch(e) {
            console.log(e)
        }

        try {
            let westRoom: Room = dungeon.getWesternRoom(room)
            let westRoomString: string = `${actionMessages.lookWest} ${westRoom.getName()}. `
            description += westRoomString
        } catch(e) {
            console.log(e)
        }

        let roomActions: string[] = room.getActions()
        let actionString: string = actionMessages.lookActions
        if (roomActions.length === 0) {
            actionString += actionMessages.lookEmpty
        } else {
            try {
                roomActions.forEach(actionId => {
                    let action: ActionElement = dungeon.getAction(actionId)
                    let actionCommand: string = action.getCommand()
                    actionString += ` ${actionCommand}`
                })
            } catch(e) {
                console.log(e)
                actionString += errorMessages.lookError
            }
        }
        actionString += ". "
        description += actionString

        let roomPlayers: Character[] = Object.values(dungeon.characters)
        let playersString: string = actionMessages.lookPlayers
        try {
            roomPlayers.forEach(character => {
                let characterName: string = character.getName()
                playersString += ` ${characterName}`
            })
        } catch(e) {
            console.log(e)
            playersString += errorMessages.lookError
        }
        playersString += ". "
        description += playersString
        this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: description}})
    }
}