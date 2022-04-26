import { Character, Dungeon, Room } from '../../dungeon/dungeon';
import { DungeonController } from '../dungeon-controller';
import { Action } from './action';
import { AmqpAdapter } from '../amqp-adapter';

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
        this.trigger = 'gehe';
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
        let dungeonId: string = dungeon.getId();
        let direction: string = args[0];
        let senderCharacter: Character = dungeon.getCharacter(user);
        let senderCharacterName: string = senderCharacter.getName();
        let senderCharacterId: string = senderCharacter.getId();
        let currentRoomId: string = senderCharacter.getPosition();
        let currentRoom: Room = dungeon.getRoom(currentRoomId);
        let destinationRoom: Room | undefined;
        let invalidDirection: boolean = false;
        let closedPath: boolean = false;
        let routingKeySender = `${dungeonId}.character.${senderCharacterId}`;
        try {
            switch (direction) {
                case 'Norden':
                    destinationRoom = dungeon.getNorthernRoom(currentRoom);
                    if (destinationRoom.getSouthConnection() === 'closed') {
                        closedPath = true;
                    }
                    break;
                case 'Osten':
                    destinationRoom = dungeon.getEasternRoom(currentRoom);
                    if (currentRoom.getEastConnection() === 'closed') {
                        closedPath = true;
                    }
                    break;
                case 'Sueden':
                    destinationRoom = dungeon.getSouthernRoom(currentRoom);
                    if (currentRoom.getSouthConnection() === 'closed') {
                        closedPath = true;
                    }
                    break;
                case 'Westen':
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
                    data: { message: `Diese Richtung existiert nicht!` },
                });
            } else if (closedPath) {
                amqpAdapter.sendToClient(user, {
                    action: 'message',
                    data: { message: `In diese Richtung ist der Raum geschlossen!` },
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
                        data: { message: `${senderCharacterName} ist ${destinationRoomName} beigetreten!` },
                    });
                }, 100);
            }
        } catch (e) {
            console.log(e);
            amqpAdapter.sendToClient(user, {
                action: 'message',
                data: { message: `In diese Richtung existiert kein Raum!` },
            });
        }
    }
}
