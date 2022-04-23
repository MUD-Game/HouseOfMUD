import { Character, Dungeon, Room } from "../../dungeon/dungeon";
import { amqpAdapter } from "../dungeon-controller";
import { Action } from "./action";

export class MoveAction implements Action {
    trigger: string;
    dungeon: Dungeon;

    constructor(dungeon: Dungeon) {
        this.trigger = "gehe";
        this.dungeon = dungeon
    }
    performAction(user: string, args: string[]) {
        let dungeonId: string = this.dungeon.getId()
        let direction: string = args[0]
        let senderCharacter: Character = this.dungeon.getCharacter(user)
        let senderCharacterName: string = senderCharacter.getName()
        let senderCharacterId: string = senderCharacter.getId()
        let currentRoom: Room = senderCharacter.getPosition()
        let currentRoomId: string = currentRoom.getId()
        let destinationRoom: Room
        let destinationRoomId: string = "0"
        let destinationRoomName: string = ""
        let closedPath: boolean = false;
        let routingKeySender = `${dungeonId}.character.${senderCharacterId}`
        try {
            switch(direction) {
                case "Norden":
                    destinationRoom = this.dungeon.getNorthernRoom(currentRoom)
                    if (destinationRoom.getSouthConnection() === "closed") {
                        closedPath = true
                    } else {
                        destinationRoomId = destinationRoom.getId()
                        destinationRoomName = destinationRoom.getName()
                        senderCharacter.modifyPosition(destinationRoom)
                    }
                    break;
                case "Osten":
                    destinationRoom = this.dungeon.getEasternRoom(currentRoom)
                    if (currentRoom.getEastConnection() === "closed") {
                        closedPath = true
                    } else {
                        destinationRoomId = destinationRoom.getId()
                        destinationRoomName = destinationRoom.getName()
                        senderCharacter.modifyPosition(destinationRoom)
                    }
                    break;
                case "Sueden":
                    destinationRoom = this.dungeon.getSouthernRoom(currentRoom)
                    if (currentRoom.getSouthConnection() === "closed") {
                        closedPath = true
                    } else {
                        destinationRoomId = destinationRoom.getId()
                        destinationRoomName = destinationRoom.getName()
                        senderCharacter.modifyPosition(destinationRoom)
                    }
                    break;
                case "Westen":
                    destinationRoom = this.dungeon.getWesternRoom(currentRoom)
                    if (destinationRoom.getEastConnection() === "closed") {
                        closedPath = true
                    } else {
                        destinationRoomId = destinationRoom.getId()
                        destinationRoomName = destinationRoom.getName()
                        senderCharacter.modifyPosition(destinationRoom) 
                    }
                    break;
            }
            if (closedPath) {
                amqpAdapter.sendToClient(routingKeySender, {action: "message", data: {message: `In diese Richtung ist der Raum geschlossen!`}})
            } else {
                let routingKey: string = `${dungeonId}.room.${destinationRoomId}`
                amqpAdapter.unbindClientQueue(user, `room.${currentRoomId}`)
                amqpAdapter.bindClientQueue(user, `room.${destinationRoomId}`)
                amqpAdapter.sendWithRouting(routingKey, {action: "message", data: {message: `${senderCharacterName} ist ${destinationRoomName} beigetreten!`}})
            }
        } catch(e) {
            console.log(e)
            amqpAdapter.sendToClient(routingKeySender, {action: "message", data: {message: `In diese Richtung existiert kein Raum!`}})
        }
    }
}
