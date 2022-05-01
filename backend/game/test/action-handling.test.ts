import { CharacterStats } from "../src/data/datasets/charcterStats";
import { ActionElement, ActionElementImpl } from "../src/data/interfaces/actionElement";
import { ActionEventImpl } from "../src/data/interfaces/actionEvent";
import { Character, CharacterImpl } from "../src/data/interfaces/character";
import { CharacterClass, CharacterClassImpl } from "../src/data/interfaces/characterClass";
import { CharacterGender, CharacterGenderImpl } from "../src/data/interfaces/characterGender";
import { CharacterSpecies, CharacterSpeciesImpl } from "../src/data/interfaces/characterSpecies";
import { CharacterStatsImpl } from "../src/data/interfaces/characterStats";
import { ConnectionInfo, ConnectionInfoImpl } from "../src/data/interfaces/connectionInfo";
import { Dungeon, DungeonImpl } from "../src/data/interfaces/dungeon";
import { Item, ItemImpl } from "../src/data/interfaces/item";
import { Npc, NpcImpl } from "../src/data/interfaces/npc";
import { Room, RoomImpl } from "../src/data/interfaces/room";
import { ActionHandler, ActionHandlerImpl } from "../src/worker/action/action-handler";
import { actionMessages, errorMessages, triggers } from "../src/worker/action/actions/action-resources";
import { BroadcastMessageAction } from "../src/worker/action/actions/broadcast-message-action";
import { DiscardAction } from "../src/worker/action/actions/discard-action";
import { DungeonAction } from "../src/worker/action/actions/dungeon-action";
import { InspectAction } from "../src/worker/action/actions/inspect-action";
import InvalidAction from "../src/worker/action/actions/invalid-action";
import { InventoryAction } from "../src/worker/action/actions/inventory-action";
import { LookAction } from "../src/worker/action/actions/look-action";
import { MessageAction } from "../src/worker/action/actions/message-action";
import { MessageMasterAction } from "../src/worker/action/actions/message-dm-action";
import { MoveAction } from "../src/worker/action/actions/move-action";
import { PickupAction } from "../src/worker/action/actions/pickup-action";
import { PrivateMessageAction } from "../src/worker/action/actions/private-message-action";
import UnspecifiedAction from "../src/worker/action/actions/unspecified-action";
import { AmqpAdapter } from "../src/worker/amqp/amqp-adapter";
import { DungeonController } from "../src/worker/controller/dungeon-controller";

// Testdaten
const amqpAdapter: AmqpAdapter = new AmqpAdapter(
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test'
);
const TestSpecies: CharacterSpecies = new CharacterSpeciesImpl(
    '1',
    'Hexer',
    'Hexiger Hexer'
);
const TestStartStats: CharacterStats = new CharacterStatsImpl(100, 20, 100);
const TestMaxStats: CharacterStats = new CharacterStatsImpl(100, 20, 100);
const TestGender: CharacterGender = new CharacterGenderImpl(
    '1',
    'Mann',
    'Maennlicher Mann'
);
const TestClass: CharacterClass = new CharacterClassImpl(
    '1',
    'Magier',
    'Magischer Magier',
    TestMaxStats,
    TestStartStats
);
const TestNpc: Npc = new NpcImpl(
    '1',
    'Bernd',
    'Bernd liebt die Musik',
    'Barde'
);
const TestItem: Item = new ItemImpl('1', 'Apfel', 'Apfliger Apfel');
const TestItemDiscard: Item = new ItemImpl('2', 'Schwert', 'Schwertiges Schwert');
const TestItemPickup: Item = new ItemImpl('3', 'Gold', 'Goldiges Gold')

const TestConnections: ConnectionInfo = new ConnectionInfoImpl(
    'open',
    'open'
);
const TestAction: ActionElement = new ActionElementImpl(
    '1',
    'essen Apfel',
    'gegessen',
    'essen aktion',
    [new ActionEventImpl('addhp', '10')],
    ['1']
);
const TestRoom: Room = new RoomImpl(
    '1',
    'Raum-1',
    'Der Raum in dem alles begann',
    [TestNpc.id],
    [TestItem.id],
    TestConnections,
    [TestAction.id],
    2,
    2
);
const TestRoomNorth: Room = new RoomImpl(
    '2',
    'Raum-N',
    'Der Raum im Norden',
    [TestNpc.id],
    [TestItem.id],
    new ConnectionInfoImpl('inactive', 'open'),
    [TestAction.id],
    2,
    1
);
const TestRoomEast: Room = new RoomImpl(
    '3',
    'Raum-O',
    'Der Raum im Osten',
    [TestNpc.id],
    [TestItem.id],
    new ConnectionInfoImpl('inactive', 'inactive'),
    [TestAction.id],
    3,
    2
);
const TestRoomSouth: Room = new RoomImpl(
    '4',
    'Raum-S',
    'Der Raum im Sueden',
    [TestNpc.id],
    [TestItem.id],
    new ConnectionInfoImpl('inactive', 'inactive'),
    [TestAction.id],
    2,
    3
);
const TestRoomWest: Room = new RoomImpl(
    '5',
    'Raum-W',
    'Der Raum im Westen',
    [TestNpc.id],
    [TestItem.id],
    new ConnectionInfoImpl('open', 'inactive'),
    [TestAction.id],
    1,
    2
);
const TestRoomNorthNorth: Room = new RoomImpl(
    '6',
    'Raum-NN',
    'Der Raum im Norden, Norden',
    [TestNpc.id],
    [TestItem.id],
    new ConnectionInfoImpl('inactive', 'closed'),
    [TestAction.id],
    2,
    0
);
const TestRoomNorthEast: Room = new RoomImpl(
    '7',
    'Raum-NE',
    'Der Raum im Norden, dann Osten',
    [TestNpc.id],
    [TestItem.id],
    new ConnectionInfoImpl('inactive', 'inactive'),
    [TestAction.id],
    3,
    1
);
const TestCharacter: Character = new CharacterImpl(
    '1',
    '1',
    'Jeff',
    'Magier',
    '1',
    '1',
    TestMaxStats,
    TestStartStats,
    TestRoom.id,
    [TestItem.id]
);
const TestCharacterSameRoom: Character = new CharacterImpl(
    '2',
    '1',
    'Spieler',
    'Magier',
    '1',
    '1',
    TestMaxStats,
    TestStartStats,
    TestRoom.id,
    [TestItem.id]
);
const TestCharacterNotSameRoom: Character = new CharacterImpl(
    '3',
    '1',
    'Bob',
    'Magier',
    '1',
    '1',
    TestMaxStats,
    TestStartStats,
    TestRoomNorth.id,
    [TestItem.id]
);
const TestDungeon: Dungeon = new DungeonImpl(
    '1',
    'TestDungeon1',
    'Test',
    '1',
    '1',
    2,
    1,
    [TestSpecies],
    [TestClass],
    [TestGender],
    [TestCharacter, TestCharacterSameRoom, TestCharacterNotSameRoom],
    [
        TestRoom,
        TestRoomNorth,
        TestRoomEast,
        TestRoomSouth,
        TestRoomWest,
        TestRoomNorthNorth,
        TestRoomNorthEast
    ],
    ['abc'],
    [TestAction],
    [TestItem, TestItemDiscard, TestItemPickup],
    [TestNpc]
);
const TestDungeonController: DungeonController = new DungeonController(
    '1',
    amqpAdapter,
    TestDungeon
);

describe('ActionHandler', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const actionHandler: ActionHandler = new ActionHandlerImpl(TestDungeonController);
    const messageAction: MessageAction = actionHandler.actions[triggers.message];
    const privateMessageAction: PrivateMessageAction = actionHandler.actions[triggers.whisper];
    const messageMasterAction: MessageMasterAction = actionHandler.actions[triggers.messageMaster]
    const broadcastMessageAction: BroadcastMessageAction = actionHandler.actions[triggers.broadcast]
    const discardAction: DiscardAction = actionHandler.actions[triggers.discard];
    const inspectAction: InspectAction = actionHandler.actions[triggers.inspect];
    const inventoryAction: InventoryAction = actionHandler.actions[triggers.inventory];
    const lookAction: LookAction = actionHandler.actions[triggers.look];
    const moveAction: MoveAction = actionHandler.actions[triggers.move];
    const pickupAction: PickupAction = actionHandler.actions[triggers.pickup];
    const dungeonAction: DungeonAction = actionHandler.dungeonActions['essen Apfel'];
    const unspecifiedAction: UnspecifiedAction = actionHandler.actions[triggers.unspecified];
    const invalidAction: InvalidAction = actionHandler.invalidAction;
    
    messageAction.performAction = jest.fn();
    privateMessageAction.performAction = jest.fn();
    messageMasterAction.performAction = jest.fn();
    broadcastMessageAction.performAction = jest.fn();
    discardAction.performAction = jest.fn();
    inspectAction.performAction = jest.fn();
    inventoryAction.performAction = jest.fn();
    lookAction.performAction = jest.fn();
    moveAction.performAction = jest.fn();
    pickupAction.performAction = jest.fn();
    dungeonAction.performAction = jest.fn();
    unspecifiedAction.performAction = jest.fn();
    invalidAction.performAction = jest.fn();

    test('ActionHandler should call performAction on InvalidAction when the dungeon master tries an action that isnt either fluester or broadcast', () => {
        actionHandler.processAction('0', `${triggers.message} Hallo`);
        actionHandler.processAction('0', `${triggers.messageMaster} Hallo`);
        actionHandler.processAction('0', `${triggers.discard} Apfel`);
        actionHandler.processAction('0', `${triggers.inspect} Apfel`);
        actionHandler.processAction('0', triggers.inventory);
        actionHandler.processAction('0', triggers.look);
        actionHandler.processAction('0', `${triggers.pickup} Apfel`);
        actionHandler.processAction('0', `essen Apfel`);
        actionHandler.processAction('0', `${triggers.unspecified} Test`);
        expect(messageAction.performAction).not.toHaveBeenCalled()
        expect(messageMasterAction.performAction).not.toHaveBeenCalled()
        expect(discardAction.performAction).not.toHaveBeenCalled()
        expect(inspectAction.performAction).not.toHaveBeenCalled()
        expect(inventoryAction.performAction).not.toHaveBeenCalled()
        expect(lookAction.performAction).not.toHaveBeenCalled()
        expect(pickupAction.performAction).not.toHaveBeenCalled()
        expect(dungeonAction.performAction).not.toHaveBeenCalled()
        expect(unspecifiedAction.performAction).not.toHaveBeenCalled()
    })

    test('ActionHandler should call performAction on MessageAction with the correct parameters when it receives a "sag" action message', () => {
        actionHandler.processAction('Jeff', `${triggers.message} Hallo`);
        expect(messageAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Hallo',
        ]);
    });
    test('ActionHandler should call performAction on PrivateMessageAction with the correct parameters when it receives a "fluester" action message', () => {
        actionHandler.processAction('Jeff', `${triggers.whisper} Spieler Hallo`);
        expect(privateMessageAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Spieler',
            'Hallo',
        ]);
    });
    test('ActionHandler should call performAction on DiscardAction with the correct parameters when it receives a "ablegen" action message', () => {
        actionHandler.processAction('Jeff', `${triggers.discard} Apfel`);
        expect(discardAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Apfel',
        ]);
    });
    test('ActionHandler should call performAction on InspectAction with the correct parameters when it receives a "untersuche" action message', () => {
        actionHandler.processAction('Jeff', `${triggers.inspect} Apfel`);
        expect(inspectAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Apfel',
        ]);
    });
    test('ActionHandler should call performAction on InventoryAction with the correct parameters when it receives a "inv" action message', () => {
        actionHandler.processAction('Jeff', triggers.inventory);
        expect(inventoryAction.performAction).toHaveBeenCalledWith('Jeff', []);
    });
    test('ActionHandler should call performAction on LookAction with the correct parameters when it receives a "umschauen" action message', () => {
        actionHandler.processAction('Jeff', triggers.look);
        expect(lookAction.performAction).toHaveBeenCalledWith('Jeff', []);
    });
    test('ActionHandler should call performAction on MoveAction with the correct parameters when it receives a "gehe" action message', () => {
        actionHandler.processAction('Jeff', `${triggers.move} Norden`);
        expect(moveAction.performAction).toHaveBeenCalledWith('Jeff', ['Norden']);
    });
    test('ActionHandler should call performAction on PickupAction with the correct parameters when it receives a "aufheben" action message', () => {
        actionHandler.processAction('Jeff', `${triggers.pickup} Apfel`);
        expect(pickupAction.performAction).toHaveBeenCalledWith('Jeff', ['Apfel']);
    });
    test('ActionHandler should call performAction on DungeonAction with the correct parameters when it receives a non standard action message', () => {
        actionHandler.processAction('Jeff', 'essen Apfel');
        expect(dungeonAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Apfel',
        ]);
    });
    test('ActionHandler should call performAction on UnspecifiedAction with the correct parameters when it receives an action message for the dungeon master', () => {
        actionHandler.processAction('Jeff', `${triggers.unspecified} Test`);
        expect(unspecifiedAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Test',
        ]);
    });
    test('ActionHandler should call performAction on InvalidAction with the correct parameters when it receives an invalid action message', () => {
        actionHandler.processAction('Jeff', 'angriff Monster');
        expect(invalidAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Monster',
        ]);
    });
    //Tests with dungeon master as user
    test('ActionHandler should call performAction on PrivateMessageAction when the dungeon master sends a message to a user', () => {
        actionHandler.processAction('0', `${triggers.whisper} Spieler Hilfe`);
        expect(privateMessageAction.performAction).toHaveBeenCalledWith('0', ['Spieler', 'Hilfe'])
    })
    test('ActionHandler should call performAction on BroadcastMessage when the dungeon master broadcasts a message to all users', () => {
        actionHandler.processAction('0', `${triggers.broadcast} Hallo`);
        expect(broadcastMessageAction.performAction).toHaveBeenCalledWith('0', ['Hallo'])
    })
    test('ActionHandler should call performAction on InvalidAction when a regular player tries to use the broadcast action', () => {
        actionHandler.processAction('Jeff', `${triggers.broadcast} Hallo`);
        expect(invalidAction.performAction).toHaveBeenCalledWith('Jeff', ['Hallo'])
    })
    test('ActionHandler should call performAction on MessageMasterAction with the correct parameters when it receives a "fluesterdm" action message', () => {
        actionHandler.processAction('Jeff', `${triggers.messageMaster} Hallo`);
        expect(messageMasterAction.performAction).toHaveBeenCalledWith('Jeff', [
            'Hallo',
        ]);
    });
    
});

describe('Actions', () => {
    beforeAll(() => {
        console.log(TestDungeon)
    })
    beforeEach(() => {
        TestDungeon.characters['Jeff'].position = TestRoom.id;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    const actionHandler: ActionHandler = new ActionHandlerImpl(TestDungeonController);
    const messageAction: MessageAction = actionHandler.actions[triggers.message];
    const privateMessageAction: PrivateMessageAction = actionHandler.actions[triggers.whisper];
    const messageMasterAction: MessageMasterAction = actionHandler.actions[triggers.messageMaster]
    const broadcastMessageAction: BroadcastMessageAction = actionHandler.actions[triggers.broadcast]
    const discardAction: DiscardAction = actionHandler.actions[triggers.discard];
    const inspectAction: InspectAction = actionHandler.actions[triggers.inspect];
    const inventoryAction: InventoryAction = actionHandler.actions[triggers.inventory];
    const lookAction: LookAction = actionHandler.actions[triggers.look];
    const moveAction: MoveAction = actionHandler.actions[triggers.move];
    const pickupAction: PickupAction = actionHandler.actions[triggers.pickup];
    const dungeonAction: DungeonAction = actionHandler.dungeonActions['essen Apfel'];
    const unspecifiedAction: UnspecifiedAction = actionHandler.actions[triggers.unspecified];

    amqpAdapter.sendWithRouting = jest.fn();
    amqpAdapter.sendToClient = jest.fn();
    amqpAdapter.broadcast = jest.fn();
    amqpAdapter.bindClientQueue = jest.fn();
    amqpAdapter.unbindClientQueue = jest.fn();
    jest.useFakeTimers()

    test('MessageAction should call sendWithRouting on the AmqpAdapter with the correct routingKey and payload', () => {
        messageAction.performAction('Jeff', [
            'Hallo',
            'zusammen!',
        ]);
        expect(amqpAdapter.sendWithRouting).toHaveBeenCalledWith('room.1', {
            action: 'message',
            data: { message: `[Raum-1] Jeff ${actionMessages.say} Hallo zusammen!` },
        });
    });

    test('PrivateMessageAction should call sendToClient on the AmqpAdapter to both users with the correct payload', () => {
        privateMessageAction.performAction('Jeff', [
            'Spieler',
            'Hallo',
        ]);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: '[privat] Jeff -> Spieler: Hallo' },
        });
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Spieler', {
            action: 'message',
            data: { message: '[privat] Jeff -> Spieler: Hallo' },
        });
    });

    test('PrivateMessageAction should call sendToClient on the AmqpAdapter to both users with the correct payload when dungeon master whispers to a player', () => {
        privateMessageAction.performAction('0', [
            'Spieler',
            'Hallo',
        ]);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('0', {
            action: 'message',
            data: { message: `[privat] ${actionMessages.dmWhisper} -> Spieler: Hallo` },
        });
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Spieler', {
            action: 'message',
            data: { message: `[privat] ${actionMessages.dmWhisper} -> Spieler: Hallo` },
        });
    });

    test('PrivateMessageAction should call sendToClient on the AmqpAdapter to the initial sender saying the recipient is not in the same room when trying to send a message to a character that is not in the same room', () => {
        privateMessageAction.performAction('Jeff', [
            'Bob',
            'Hallo',
        ]);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: `Bob ${actionMessages.whisperCharacterNotInSameRoom}` },
        });
    });

    test('PrivateMessageAction should call sendToClient on the AmqpAdapter to the initial sender saying the recipient does not exist in the dungeon when trying to send a message to a character that does not exist', () => {
        privateMessageAction.performAction('Jeff', [
            'Held',
            'Hallo',
        ]);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: {
                message:
                    `${errorMessages.characterDoesNotExist1} Held ${errorMessages.characterDoesNotExist2}`,
            },
        });
    });

    
    test(`MoveAction should modify the position, call the functions to bind the client queues 
    and call sendWithRouting on the AmqpAdapter when user moves to another room`, () => {
        moveAction.performAction('Jeff', ['Norden']);
        expect(TestDungeon.characters['Jeff'].position).toBe(TestRoomNorth.id);
        expect(amqpAdapter.unbindClientQueue).toHaveBeenCalledWith(
            'Jeff',
            'room.1'
        );
        expect(amqpAdapter.bindClientQueue).toHaveBeenCalledWith('Jeff', 'room.2');
        jest.runAllTimers()
        expect(amqpAdapter.sendWithRouting).toHaveBeenCalledWith('room.2', {
            action: 'message',
            data: { message: `Jeff ${actionMessages.move1} Raum-N ${actionMessages.move2}` },
        });
    });

    test('MoveAction should modify the position to the room in the East when user moves east', () => {
        moveAction.performAction('Jeff', ['Osten']);
        expect(TestDungeon.characters['Jeff'].position).toBe(TestRoomEast.id);
    });

    test('MoveAction should modify the position to the room in the South when user moves south', () => {
        moveAction.performAction('Jeff', ['Sueden']);
        expect(TestDungeon.characters['Jeff'].position).toBe(TestRoomSouth.id);
    });

    test('MoveAction should modify the position to the room in the West when user moves west', () => {
        moveAction.performAction('Jeff', ['Westen']);
        expect(TestDungeon.characters['Jeff'].position).toBe(TestRoomWest.id);
    });

    test('MoveAction should call sendToClient on AmqpAdapter to the initial sender saying the room does not exist when the user tries to move to a direction where a room does not exist', () => {
        TestDungeon.characters['Jeff'].position = TestRoomNorth.id;
        moveAction.performAction('Jeff', ['Osten']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: actionMessages.movePathNotAvailable },
        });
    });

    test('MoveAction should call sendToClient on AmqpAdapter to the initial sender saying the user input an invalid direction when the user inputs anything but Norden, Osten, Sueden or Westen', () => {
        TestDungeon.characters['Jeff'].position = TestRoomNorth.id;
        moveAction.performAction('Jeff', ['Nord-Sueden']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: errorMessages.directionDoesNotExist },
        });
    });

    test('MoveAction should call sendToClient on AmqpAdapter to the initial sender saying the room is closed when the user tries to move into a room that is closed', () => {
        TestDungeon.characters['Jeff'].position = TestRoomNorth.id;
        moveAction.performAction('Jeff', ['Norden']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: actionMessages.moveRoomClosed },
        });
    });
    test('MoveAction should call sendToClient on AmqpAdapter to the initial sender saying the path does not exist', () => {
        TestDungeon.characters['Jeff'].position = TestRoomNorthNorth.id;
        moveAction.performAction('Jeff', ['Osten']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: actionMessages.movePathNotAvailable },
        });
    });
    //MOVEACTION TEST

    test('LookAction should call sendToClient on AmqpAdapter with the correct routingKey and payload', () => {
        lookAction.performAction('Jeff', []);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: {
                message:
                    'Du befindest dich im Raum Raum-1: Der Raum in dem alles begann. Du schaust dich um. Es liegen folgende Items in dem Raum: Apfel. Folgende NPCs sind in diesem Raum: Bernd. Im Norden befindet sich folgender Raum: Raum-N. Im Osten befindet sich folgender Raum: Raum-O. Im Sueden befindet sich folgender Raum: Raum-S. Im Westen befindet sich folgender Raum: Raum-W. Du kannst in diesem Raum folgende Aktionen ausfuehren: essen Apfel. In diesem Raum befinden sich folgende Spieler: Jeff Spieler Bob. ',
            },
        });
    });

    test('InventoryAction should call sendToClient on AmqpAdapter with the correct routingKey and payload', () => {
        inventoryAction.performAction('Jeff', []);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: `${actionMessages.inventory} Apfel` },
        });
    });

    test('InspectAction should call sendToClient on AmqpAdapter with the correct routingKey and payload', () => {
        inspectAction.performAction('Jeff', ['Apfel']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: `${actionMessages.inspect} Apfel: Apfliger Apfel` },
        });
    });

    test('InspectAction should call sendToClient on AmqpAdapter saying the user does not have the item when the user does not have the item', () => {
        inspectAction.performAction('Jeff', ['Birne']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: errorMessages.itemNotOwned },
        });
    });

    test('MessageMasterAction should call sendToClient on the AmqpAdapter to both the sender and the dungeon master with the correct payload', () => {
        messageMasterAction.performAction('Jeff', [
            'Hallo'
        ]);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: `[privat] Jeff -> ${actionMessages.dmWhisper}: Hallo` },
        });
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('0', {
            action: 'message',
            data: { message: `[privat] Jeff -> ${actionMessages.dmWhisper}: Hallo` },
        });
    })

    test('DiscardAction should call sendToClient on AmqpAdapter and modify the inventory of the character and the room items list when user discards an item', () => {
        TestDungeon.characters['Jeff'].inventory.push(TestItemDiscard.id)
        discardAction.performAction('Jeff', ['Schwert']);
        expect(TestDungeon.characters['Jeff'].inventory).toStrictEqual([TestItem.id])
        expect(TestDungeon.rooms['1'].items).toStrictEqual([TestItem.id, TestItemDiscard.id])
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: `${actionMessages.discard}Schwert` },
        });
        TestDungeon.rooms['1'].items.pop()
    })

    test('DiscardAction should call sendToClient on AmqpAdapter notifying the user that he does not own the item when he tries to discard an item he does not own', () => {
        discardAction.performAction('Jeff', ['Gold']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: errorMessages.itemNotOwned },
        });
    })

    test('DiscardAction should call sendToClient on AmqpAdapter notifying the user that he does not own the item when he tries to discard an item that does not exist in the dungeon', () => {
        discardAction.performAction('Jeff', ['Rubin']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: errorMessages.itemNotOwned },
        });
    })

    test('PickupAction should call sendToClient on AmqpAdapter and modify the inventory of the character and the room items list when user picks up an item', () => {
        TestDungeon.rooms[TestRoom.id].items.push(TestItemPickup.id)
        pickupAction.performAction('Jeff', ['Gold']);
        expect(TestDungeon.characters['Jeff'].inventory).toStrictEqual([TestItem.id, TestItemPickup.id])
        expect(TestDungeon.rooms['1'].items).toStrictEqual([TestItem.id])
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: `${actionMessages.pickup}Gold` },
        });
        TestDungeon.characters['Jeff'].inventory.pop()
    })

    test('PickupAction should call sendToClient on AmqpAdapter notifying the user that he does not own the item when he tries to pickup an item the room does not hold', () => {
        pickupAction.performAction('Jeff', ['Schwert']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: errorMessages.itemNotInRoom },
        });
    })

    test('PickupAction should call sendToClient on AmqpAdapter notifying the user that he does not own the item when he tries to pick up an item that does not exist in the dungeon', () => {
        pickupAction.performAction('Jeff', ['Rubin']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('Jeff', {
            action: 'message',
            data: { message: errorMessages.itemNotInRoom },
        });
    })
});
