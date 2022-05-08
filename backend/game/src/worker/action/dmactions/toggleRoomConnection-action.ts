import { Dungeon } from "../../../data/interfaces/dungeon";
import { Room } from "../../../data/interfaces/room";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, dungeonMasterSendMessages, parseResponseString, triggers } from "../actions/action-resources";

export class ToggleConnectionAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.toggleConnection;
        this.dungeonController = dungeonController
    }

    performAction(user: string, args: string[]) {
        console.log('Not implemented')
    }

    async modifyConnection(roomId: string, direction: string, status: string) {
        console.log(roomId)
        console.log(direction)
        console.log(status)
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let dungeon: Dungeon = this.dungeonController.getDungeon();
        console.log(dungeon)
        let room: Room = dungeon.getRoom(roomId);
        let roomName: string = room.getName()
        let roomThatPathLeadsTo: Room;
        let nameOfRoomThatPathLeadsTo: string = ' ';
        let newStatusString: string = ' '
        if (direction === 'east') {
            room.setEastConnection(status)
            roomThatPathLeadsTo = dungeon.getEasternRoom(room)
            nameOfRoomThatPathLeadsTo = roomThatPathLeadsTo.getName()
        } else if (direction === 'south') {
            room.setSouthConnection(status)
            roomThatPathLeadsTo = dungeon.getSouthernRoom(room)
            nameOfRoomThatPathLeadsTo = roomThatPathLeadsTo.getName()
        }
        if (status === 'open') {
            newStatusString = dungeonMasterSendMessages.connectionOpen
        } else if (status === 'closed') {
            newStatusString = dungeonMasterSendMessages.connectionClosed
        }
        await amqpAdapter.broadcastAction('message', { message: parseResponseString(dungeonMasterSendMessages.toggleConnection, roomName, nameOfRoomThatPathLeadsTo, newStatusString) });
        await amqpAdapter.broadcastAction('minimap.connection', { roomId: roomId, direction: direction, status: status });
    }
}