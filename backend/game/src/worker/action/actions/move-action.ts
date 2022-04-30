import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Room } from "../../../data/interfaces/room";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, errorMessages, actionMessages } from "./action-resources";

export class MoveAction implements Action {
    /**
     * Chat command to trigger the action.
     */
    trigger: string;

    /**
     * DungeonController which holds the relevant AmqpAdapter and Dungeon data.
     */
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.move;
        this.dungeonController = dungeonController;
    }

    /**
     * Modifies the character position if passage exists and sends appropriate message to client.
     * @param user Character id of user that sent the message.
     * @param args Arguments received by ActionHandler. In this case direction in which the player wants to move.
     */
    performAction(user: string, args: string[]) {
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
        try {
            switch (direction.toLowerCase()) {
                case 'norden':
                    destinationRoom = dungeon.getNorthernRoom(currentRoom);
                    if (destinationRoom.getSouthConnection() === 'closed') {
                        closedPath = true;
                    }
                    break;
                case 'osten':
                    destinationRoom = dungeon.getEasternRoom(currentRoom);
                    if (currentRoom.getEastConnection() === 'closed') {
                        closedPath = true;
                    }
                    break;
                case 'sueden':
                    destinationRoom = dungeon.getSouthernRoom(currentRoom);
                    if (currentRoom.getSouthConnection() === 'closed') {
                        closedPath = true;
                    }
                    break;
                case 'westen':
                    destinationRoom = dungeon.getWesternRoom(currentRoom);
                    if (destinationRoom.getEastConnection() === 'closed') {
                        closedPath = true;
                    }
                    break;
                default:
                    invalidDirection = true;
                    break;
            }
            if (invalidDirection) {
                amqpAdapter.sendToClient(user, {
                    action: 'message',
                    data: { message: errorMessages.directionDoesNotExist },
                });
            } else if (closedPath) {
                amqpAdapter.sendToClient(user, {
                    action: 'message',
                    data: { message: actionMessages.moveRoomClosed },
                });
            } else if (destinationRoom !== undefined) {
                let destinationRoomId: string = destinationRoom.getId();
                let destinationRoomName: string = destinationRoom.getName();
                senderCharacter.modifyPosition(destinationRoomId);
                let routingKey: string = `room.${destinationRoomId}`;
                amqpAdapter.unbindClientQueue(user, `room.${currentRoomId}`);
                amqpAdapter.bindClientQueue(user, `room.${destinationRoomId}`);
                setTimeout(() => {
                    amqpAdapter.sendWithRouting(routingKey, {
                        action: 'message',
                        data: { message: `${senderCharacterName} ${actionMessages.move1} ${destinationRoomName} ${actionMessages.move2}` },
                    });
                }, 100);
            }
        } catch (e) {
            console.log(e);
            amqpAdapter.sendToClient(user, {
                action: 'message',
                data: { message: actionMessages.moveRoomDoesNotExist },
            });
        }
    }
}
