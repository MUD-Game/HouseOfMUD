import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Room } from "../../../data/interfaces/room";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, errorMessages, actionMessages, parseResponseString, extras } from "./action-resources";

export class MoveAction extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.move, dungeonController);
    }

    /**
     * Modifies the character position if passage exists and sends appropriate message to client.
     * @param user Character id of user that sent the message.
     * @param args Arguments received by ActionHandler. In this case direction in which the player wants to move.
     */
    async performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon();
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter();
        let direction: string = args[0];
        let senderCharacter: Character = dungeon.getCharacter(user);
        let senderCharacterName: string = senderCharacter.getName();
        let currentRoomId: string = senderCharacter.getPosition();
        let currentRoom: Room = dungeon.getRoom(currentRoomId);
        let destinationRoom: Room | undefined;
        let invalidDirection: boolean = false;
        let closedPath: boolean = false;
        let inactivePath: boolean = false;
        // Refactorn, raume ohne exceptions abfragen
        try {
            switch (direction.toLowerCase()) {
                case 'norden':
                    destinationRoom = dungeon.getNorthernRoom(currentRoom);
                    if (destinationRoom.getSouthConnection() === 'closed') {
                        closedPath = true;
                    } else if (destinationRoom.getSouthConnection() === 'inactive') {
                        inactivePath = true;
                    }
                    break;
                case 'osten':
                    destinationRoom = dungeon.getEasternRoom(currentRoom);
                    if (currentRoom.getEastConnection() === 'closed') {
                        closedPath = true;
                    } else if (currentRoom.getEastConnection() === 'inactive') {
                        inactivePath = true;
                    }
                    break;
                case 'sueden':
                    destinationRoom = dungeon.getSouthernRoom(currentRoom);
                    if (currentRoom.getSouthConnection() === 'closed') {
                        closedPath = true;
                    } else if (currentRoom.getSouthConnection() === 'inactive') {
                        inactivePath = true;
                    }
                    break;
                case 'westen':
                    destinationRoom = dungeon.getWesternRoom(currentRoom);
                    if (destinationRoom.getEastConnection() === 'closed') {
                        closedPath = true;
                    } else if (destinationRoom.getEastConnection() === 'inactive') {
                        inactivePath = true;
                    }
                    break;
                default:
                    invalidDirection = true;
                    break;
            }
            if (invalidDirection) {
                amqpAdapter.sendActionToClient(user, 'message', { message: errorMessages.directionDoesNotExist + errorMessages.moveAvailableDirections});
            } else if (closedPath) {
                amqpAdapter.sendActionToClient(user, 'message', { message: actionMessages.moveRoomClosed });
            } else if (inactivePath) {
                amqpAdapter.sendActionToClient(user, 'message', { message: actionMessages.movePathNotAvailable });
            } else if (destinationRoom !== undefined) {
                let destinationRoomId: string = destinationRoom.getId();
                let destinationRoomName: string = destinationRoom.getName();
                let routingKeyOldRoom: string = `room.${currentRoomId}`
                let routingKeyNewRoom: string = `room.${destinationRoomId}`;
                await amqpAdapter.sendActionWithRouting(routingKeyOldRoom, 'message', { message: parseResponseString(actionMessages.moveLeave, senderCharacterName, currentRoom.getName()) });
                senderCharacter.modifyPosition(destinationRoomId);
                await amqpAdapter.unbindClientQueue(user, routingKeyOldRoom);
                await amqpAdapter.bindClientQueue(user, routingKeyNewRoom);
                await amqpAdapter.sendActionWithRouting(routingKeyNewRoom, 'message', { message: parseResponseString(actionMessages.moveEnter, senderCharacterName, destinationRoomName)});
                // messages sent to dungeon master
                await amqpAdapter.sendActionToClient(extras.dungeonMasterId, 'message', { message: parseResponseString(actionMessages.moveLeave, senderCharacterName, currentRoom.getName()), player: senderCharacterName, room: currentRoom.getName() });
                await amqpAdapter.sendActionToClient(extras.dungeonMasterId, 'message', { message: parseResponseString(actionMessages.moveEnter, senderCharacterName, destinationRoomName), player: senderCharacterName, room: destinationRoomName });
                // Sends the new room id to the client.
                await amqpAdapter.sendActionToClient(user, 'minimap.move', destinationRoomId);
                this.dungeonController.sendPlayerListToDM();
            }
        } catch (e) {
            // console.log(e);
            amqpAdapter.sendActionToClient(user, 'message', { message: actionMessages.movePathNotAvailable});
        }
    }
}
