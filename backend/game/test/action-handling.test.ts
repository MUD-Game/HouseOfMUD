import {
    ActionElement,
    CharacterGender,
    CharacterSpecies,
    Character,
    Item,
    CharacterStats,
    CharacterClass,
    Npc,
    ConnectionInfo,
    Room,
    Dungeon,
    CharacterSpeciesImpl,
    CharacterStatsImpl,
    CharacterGenderImpl,
    CharacterClassImpl,
    NpcImpl,
    ItemImpl,
    RoomImpl,
    ConnectionInfoImpl,
    ActionElementImpl,
    CharacterImpl,
    DungeonImpl,
    EventImpl,
} from '../src/dungeon/dungeon';
import {
    ActionHandler,
    ActionHandlerImpl,
} from '../src/worker/action/action-handler';
import { DiscardAction } from '../src/worker/action/actions/discard-action';
import { DungeonAction } from '../src/worker/action/actions/dungeon-action';
import { InspectAction } from '../src/worker/action/actions/inspect-action';
import { InventoryAction } from '../src/worker/action/actions/inventory-action';
import { LookAction } from '../src/worker/action/actions/look-action';
import { MessageAction } from '../src/worker/action/actions/message-action';
import { MoveAction } from '../src/worker/action/actions/move-action';
import { PickupAction } from '../src/worker/action/actions/pickup-action';
import { PrivateMessageAction } from '../src/worker/action/actions/private-message-action';
import UnspecifiedAction from '../src/worker/action/actions/unspecified-action';
import { AmqpAdapter } from '../src/worker/amqp/amqp-adapter';
import { DungeonController } from '../src/worker/controller/dungeon-controller';

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
const TestConnections: ConnectionInfo = new ConnectionInfoImpl(
    'active',
    'active'
);
const TestAction: ActionElement = new ActionElementImpl(
    '1',
    'essen Apfel',
    'gegessen',
    'essen aktion',
    [new EventImpl('addhp', 10)],
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
    new ConnectionInfoImpl('inactive', 'active'),
    [TestAction.id],
    2,
    3
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
    1
);
const TestRoomWest: Room = new RoomImpl(
    '5',
    'Raum-W',
    'Der Raum im Westen',
    [TestNpc.id],
    [TestItem.id],
    new ConnectionInfoImpl('active', 'inactive'),
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
    4
);
const TestCharacter: Character = new CharacterImpl(
    '1',
    '1',
    '1',
    'Jeff',
    'Magier',
    TestSpecies,
    TestGender,
    TestMaxStats,
    TestStartStats,
    TestRoom.id,
    [TestItem.id]
);
const TestCharacterSameRoom: Character = new CharacterImpl(
    '2',
    '2',
    '1',
    'Spieler',
    'Magier',
    TestSpecies,
    TestGender,
    TestMaxStats,
    TestStartStats,
    TestRoom.id,
    [TestItem.id]
);
const TestCharacterNotSameRoom: Character = new CharacterImpl(
    '3',
    '3',
    '1',
    'Bob',
    'Magier',
    TestSpecies,
    TestGender,
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
    ],
    ['abc'],
    [TestAction],
    [TestItem],
    [TestNpc]
);
const TestDungeonController: DungeonController = new DungeonController(
    '1',
    amqpAdapter,
    TestDungeon
);

describe('ActionHandler', () => {
    const actionHandler: ActionHandler = new ActionHandlerImpl(TestDungeonController);
    const messageAction: MessageAction = actionHandler.actions['sag'];
    const privateMessageAction: PrivateMessageAction = actionHandler.actions['fluester'];
    const discardAction: DiscardAction = actionHandler.actions['ablegen'];
    const inspectAction: InspectAction = actionHandler.actions['untersuche'];
    const inventoryAction: InventoryAction = actionHandler.actions['inv'];
    const lookAction: LookAction = actionHandler.actions['umschauen'];
    const moveAction: MoveAction = actionHandler.actions['gehe'];
    const pickupAction: PickupAction = actionHandler.actions['aufheben'];
    const dungeonAction: DungeonAction = actionHandler.dungeonActions.find(action => action instanceof DungeonAction)!;
    const unspecifiedAction: UnspecifiedAction = actionHandler.unspecifiedAction;

    messageAction.performAction = jest.fn();
    privateMessageAction.performAction = jest.fn();
    discardAction.performAction = jest.fn();
    inspectAction.performAction = jest.fn();
    inventoryAction.performAction = jest.fn();
    lookAction.performAction = jest.fn();
    moveAction.performAction = jest.fn();
    pickupAction.performAction = jest.fn();
    dungeonAction.performAction = jest.fn();
    unspecifiedAction.performAction = jest.fn();

    test('ActionHandler should call performAction on MessageAction with the correct parameters when it receives a "sag" action message', () => {
        actionHandler.processAction('1', 'sag Hallo');
        expect(messageAction.performAction).toHaveBeenCalledWith('1', [
            'Hallo',
        ]);
    });
    test('ActionHandler should call performAction on PrivateMessageAction with the correct parameters when it receives a "fluester" action message', () => {
        actionHandler.processAction('1', 'fluester Spieler Hallo');
        expect(privateMessageAction.performAction).toHaveBeenCalledWith('1', [
            'Spieler',
            'Hallo',
        ]);
    });
    test('ActionHandler should call performAction on DiscardAction with the correct parameters when it receives a "ablegen" action message', () => {
        actionHandler.processAction('1', 'ablegen Apfel');
        expect(discardAction.performAction).toHaveBeenCalledWith('1', [
            'Apfel',
        ]);
    });
    test('ActionHandler should call performAction on InspectAction with the correct parameters when it receives a "untersuche" action message', () => {
        actionHandler.processAction('1', 'untersuche Apfel');
        expect(inspectAction.performAction).toHaveBeenCalledWith('1', [
            'Apfel',
        ]);
    });
    test('ActionHandler should call performAction on InventoryAction with the correct parameters when it receives a "inv" action message', () => {
        actionHandler.processAction('1', 'inv');
        expect(inventoryAction.performAction).toHaveBeenCalledWith('1', []);
    });
    test('ActionHandler should call performAction on LookAction with the correct parameters when it receives a "umschauen" action message', () => {
        actionHandler.processAction('1', 'umschauen');
        expect(lookAction.performAction).toHaveBeenCalledWith('1', []);
    });
    test('ActionHandler should call performAction on MoveAction with the correct parameters when it receives a "gehe" action message', () => {
        actionHandler.processAction('1', 'gehe Norden');
        expect(moveAction.performAction).toHaveBeenCalledWith('1', ['Norden']);
    });
    test('ActionHandler should call performAction on PickupAction with the correct parameters when it receives a "aufheben" action message', () => {
        actionHandler.processAction('1', 'aufheben Apfel');
        expect(pickupAction.performAction).toHaveBeenCalledWith('1', ['Apfel']);
    });
    test('ActionHandler should call performAction on DungeonAction with the correct parameters when it receives a non standard action message', () => {
        actionHandler.processAction('1', 'essen Apfel');
        expect(dungeonAction.performAction).toHaveBeenCalledWith('1', [
            'Apfel',
        ]);
    });
    test('ActionHandler should call performAction on UnspecifiedAction with the correct parameters when it receives a non specified action message', () => {
        actionHandler.processAction('1', 'angriff Monster');
        expect(unspecifiedAction.performAction).toHaveBeenCalledWith('1', [
            'Monster',
        ]);
    });
});

describe('Actions', () => {
    beforeEach(() => {
        TestDungeon.characters[0].position = TestRoom.id;
    });

    const actionHandler: ActionHandler = new ActionHandlerImpl(TestDungeonController);
    const messageAction: MessageAction = actionHandler.actions['sag'];
    const privateMessageAction: PrivateMessageAction = actionHandler.actions['fluester'];
    const discardAction: DiscardAction = actionHandler.actions['ablegen'];
    const inspectAction: InspectAction = actionHandler.actions['untersuche'];
    const inventoryAction: InventoryAction = actionHandler.actions['inv'];
    const lookAction: LookAction = actionHandler.actions['umschauen'];
    const moveAction: MoveAction = actionHandler.actions['gehe'];
    const pickupAction: PickupAction = actionHandler.actions['aufheben'];
    const dungeonAction: DungeonAction = actionHandler.dungeonActions.find(action => action instanceof DungeonAction)!;
    const unspecifiedAction: UnspecifiedAction = actionHandler.unspecifiedAction;

    amqpAdapter.sendWithRouting = jest.fn();
    amqpAdapter.sendToClient = jest.fn();
    amqpAdapter.bindClientQueue = jest.fn();
    amqpAdapter.unbindClientQueue = jest.fn();
    jest.useFakeTimers()

    test('MessageAction should call sendWithRouting on the AmqpAdapter with the correct routingKey and payload', () => {
        messageAction.performAction(TestDungeon.characters[0].id, [
            'Hallo',
            'zusammen!',
        ]);
        expect(amqpAdapter.sendWithRouting).toHaveBeenCalledWith('room.1', {
            action: 'message',
            data: { message: '[Raum-1] Jeff sagt Hallo zusammen!' },
        });
    });

    test('PrivateMessageAction should call sendToClient on the AmqpAdapter to both users with the correct payload', () => {
        privateMessageAction.performAction(TestDungeon.characters[0].id, [
            'Spieler',
            'Hallo',
        ]);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('1', {
            action: 'message',
            data: { message: '[privat] Jeff -> Spieler: Hallo' },
        });
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('2', {
            action: 'message',
            data: { message: '[privat] Jeff -> Spieler: Hallo' },
        });
    });

    test('PrivateMessageAction should call sendToClient on the AmqpAdapter to the initial sender saying the recipient is not in the same room when trying to send a message to a character that is not in the same room', () => {
        privateMessageAction.performAction(TestDungeon.characters[0].id, [
            'Bob',
            'Hallo',
        ]);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('1', {
            action: 'message',
            data: { message: 'Bob ist nicht in diesem Raum!' },
        });
    });

    test('PrivateMessageAction should call sendToClient on the AmqpAdapter to the initial sender saying the recipient does not exist in the dungeon when trying to send a message to a character that does not exist', () => {
        privateMessageAction.performAction(TestDungeon.characters[0].id, [
            'Held',
            'Hallo',
        ]);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('1', {
            action: 'message',
            data: {
                message:
                    'Der Charakter Held existiert nicht in diesem Dungeon!',
            },
        });
    });

    
    test(`MoveAction should modify the position, call the functions to bind the client queues 
    and call sendWithRouting on the AmqpAdapter when user moves to another room`, () => {
        moveAction.performAction(TestDungeon.characters[0].id, ['Norden']);
        expect(TestDungeon.characters[0].position).toBe(TestRoomNorth.id);
        expect(amqpAdapter.unbindClientQueue).toHaveBeenCalledWith(
            '1',
            'room.1'
        );
        expect(amqpAdapter.bindClientQueue).toHaveBeenCalledWith('1', 'room.2');
        jest.runAllTimers()
        expect(amqpAdapter.sendWithRouting).toHaveBeenCalledWith('room.2', {
            action: 'message',
            data: { message: 'Jeff ist Raum-N beigetreten!' },
        });
    });

    test('MoveAction should modify the position to the room in the East when user moves east', () => {
        moveAction.performAction(TestDungeon.characters[0].id, ['Osten']);
        expect(TestDungeon.characters[0].position).toBe(TestRoomEast.id);
    });

    test('MoveAction should modify the position to the room in the South when user moves south', () => {
        moveAction.performAction(TestDungeon.characters[0].id, ['Sueden']);
        expect(TestDungeon.characters[0].position).toBe(TestRoomSouth.id);
    });

    test('MoveAction should modify the position to the room in the West when user moves west', () => {
        moveAction.performAction(TestDungeon.characters[0].id, ['Westen']);
        expect(TestDungeon.characters[0].position).toBe(TestRoomWest.id);
    });

    test('MoveAction should call sendToClient on AmqpAdapter to the initial sender saying the room does not exist when the user tries to move to a direction where a room does not exist', () => {
        TestDungeon.characters[0].position = TestRoomNorth.id;
        moveAction.performAction(TestDungeon.characters[0].id, ['Osten']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('1', {
            action: 'message',
            data: { message: 'In diese Richtung existiert kein Raum!' },
        });
    });

    test('MoveAction should call sendToClient on AmqpAdapter to the initial sender saying the user input an invalid direction when the user inputs anything but Norden, Osten, Sueden or Westen', () => {
        TestDungeon.characters[0].position = TestRoomNorth.id;
        moveAction.performAction(TestDungeon.characters[0].id, ['Nord-Sueden']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('1', {
            action: 'message',
            data: { message: 'Diese Richtung existiert nicht!' },
        });
    });

    test('MoveAction should call sendToClient on AmqpAdapter to the initial sender saying the room is closed when the user tries to move into a room that is closed', () => {
        TestDungeon.characters[0].position = TestRoomNorth.id;
        moveAction.performAction(TestDungeon.characters[0].id, ['Norden']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('1', {
            action: 'message',
            data: { message: 'In diese Richtung ist der Raum geschlossen!' },
        });
    });
    //MOVEACTION TEST

    test('LookAction should call sendToClient on AmqpAdapter with the correct routingKey and payload', () => {
        lookAction.performAction(TestDungeon.characters[0].id, []);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('1', {
            action: 'message',
            data: {
                message:
                    'Du befindest dich im Raum Raum-1: Der Raum in dem alles begann. Du schaust dich um. Es liegen folgende Items in dem Raum: Apfel. Folgende NPCs sind in diesem Raum: Bernd. Im Norden befindet sich folgender Raum: Raum-N. Im Osten befindet sich folgender Raum: Raum-O. Im Sueden befindet sich folgender Raum: Raum-S. Im Westen befindet sich folgender Raum: Raum-W. Du kannst in diesem Raum folgende Aktionen ausfuehren: essen Apfel. ',
            },
        });
    });

    test('InventoryAction should call sendToClient on AmqpAdapter with the correct routingKey and payload', () => {
        inventoryAction.performAction(TestDungeon.characters[0].id, []);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('1', {
            action: 'message',
            data: { message: 'Du hast folgende Items im Inventar: Apfel' },
        });
    });

    test('InspectAction should call sendToClient on AmqpAdapter with the correct routingKey and payload', () => {
        inspectAction.performAction(TestDungeon.characters[0].id, ['Apfel']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('1', {
            action: 'message',
            data: { message: 'Du untersuchst Apfel: Apfliger Apfel' },
        });
    });

    test('InspectAction should call sendToClient on AmqpAdapter saying the user does not have the item when the user does not have the item', () => {
        inspectAction.performAction(TestDungeon.characters[0].id, ['Birne']);
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith('1', {
            action: 'message',
            data: { message: 'Du besitzt dieses Item nicht!' },
        });
    });
});
