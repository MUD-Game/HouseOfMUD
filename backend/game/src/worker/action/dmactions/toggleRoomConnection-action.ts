import { Dungeon } from "../../../data/interfaces/dungeon";
import { Room } from "../../../data/interfaces/room";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers } from "../actions/action-resources";

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

    modifyConnection(roomId: string, direction: string, status: string) {
        console.log(roomId)
        console.log(direction)
        console.log(status)
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let dungeon: Dungeon = this.dungeonController.getDungeon();
        console.log(dungeon)
        let room: Room = dungeon.getRoom(roomId);
        let roomThatPathLeadsTo: Room;
        if (direction === 'east') {
            room.setEastConnection(status)
            try {
                roomThatPathLeadsTo = dungeon.getEasternRoom(room)
            } catch(e) {
                console.log('Fehler 1')
            }
        } else if (direction === 'south') {
            room.setSouthConnection(status)
            try {
                roomThatPathLeadsTo = dungeon.getSouthernRoom(room)
            } catch(e) {
                console.log('Fehler 2')
            }
            
        }
        //await amqpAdapter.sendActionWithRouting(routingKeyOldRoom, 'message', { message: parseResponseString(actionMessages.moveLeave, senderCharacterName, currentRoom.getName()) });
    }
}