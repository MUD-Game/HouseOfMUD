import { Character, Dungeon, Room } from "../../dungeon/dungeon";
import { DungeonController } from "../dungeon-controller";
import { Action } from "./action";
import { AmqpAdapter } from "../amqp-adapter";

export class MoveAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = "gehe";
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let dungeonId: string = dungeon.getId()
        let direction: string = args[0]
        let senderCharacter: Character = dungeon.getCharacter(user)
        let senderCharacterName: string = senderCharacter.getName()
        let senderCharacterId: string = senderCharacter.getId()
        let currentRoomId: string = senderCharacter.getPosition()
        let currentRoom: Room = dungeon.getRoom(currentRoomId)
        let destinationRoom: Room
        let destinationRoomId: string = "0"
        let destinationRoomName: string = ""
        let closedPath: boolean = false;
        let routingKeySender = `${dungeonId}.character.${senderCharacterId}`
        try {
            switch(direction) {
                case "Norden":
                    destinationRoom = dungeon.getNorthernRoom(currentRoom)
                    if (destinationRoom.getSouthConnection() === "closed") {
                        closedPath = true
                    } else {
                        destinationRoomId = destinationRoom.getId()
                        destinationRoomName = destinationRoom.getName()
                        senderCharacter.modifyPosition(destinationRoomId)
                    }
                    break;
                case "Osten":
                    destinationRoom = dungeon.getEasternRoom(currentRoom)
                    if (currentRoom.getEastConnection() === "closed") {
                        closedPath = true
                    } else {
                        destinationRoomId = destinationRoom.getId()
                        destinationRoomName = destinationRoom.getName()
                        senderCharacter.modifyPosition(destinationRoomId)
                    }
                    break;
                case "Sueden":
                    destinationRoom = dungeon.getSouthernRoom(currentRoom)
                    if (currentRoom.getSouthConnection() === "closed") {
                        closedPath = true
                    } else {
                        destinationRoomId = destinationRoom.getId()
                        destinationRoomName = destinationRoom.getName()
                        senderCharacter.modifyPosition(destinationRoomId)
                    }
                    break;
                case "Westen":
                    destinationRoom = dungeon.getWesternRoom(currentRoom)
                    if (destinationRoom.getEastConnection() === "closed") {
                        closedPath = true
                    } else {
                        destinationRoomId = destinationRoom.getId()
                        destinationRoomName = destinationRoom.getName()
                        senderCharacter.modifyPosition(destinationRoomId) 
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
