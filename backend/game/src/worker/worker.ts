import {
    ActionElement,
    Character,
    CharacterClass,
    CharacterGender,
    CharacterSpecies,
    CharacterStats,
    ConnectionInfo,
    Dungeon,
    Event,
    Item,
    Npc,
    Room,
} from '../dungeon/dungeon';
import { AmqpAdapter } from './amqp-adapter';
import { DungeonController } from './dungeon-controller';

const dungeonID = process.argv[2];

interface Tokens {
    [userID: string]: {
        [characterID: string]: string;
    };
}

const userTokens: Tokens = {};

async function main() {
    handleHostMessages();
    console.log(`Starting Dungeon ${dungeonID}`);
    // TODO: get Dungeon from database
    let dungeon: Dungeon = getDungeon(dungeonID);

    let amqpConfig = getAmqpAdapterConfig();
    let amqpAdapter: AmqpAdapter = new AmqpAdapter(
        dungeonID,
        amqpConfig.url,
        amqpConfig.port,
        amqpConfig.user,
        amqpConfig.password,
        amqpConfig.serverExchange,
        amqpConfig.clientExchange
    );
    await amqpAdapter.connect();
    let dungeonController: DungeonController = new DungeonController(
        dungeonID,
        amqpAdapter,
        dungeon
    );
    dungeonController.init();
}

async function handleHostMessages() {
    process.on('message', (msg: any) => {
        let action = msg.action;
        let data = msg.data;

        switch (action) {
            case 'setCharacterToken':
                let userID = data.user;
                let characterID = data.character;
                let verifyToken = data.verifyToken;

                if (!(userID in userTokens)) {
                    userTokens[userID] = {};
                }

                userTokens[userID][characterID] = verifyToken;
                break;
            case 'stop':
                // TODO: save Dungeon to database and stop process
                break;
        }
    });
}

function getAmqpAdapterConfig() {
    return {
        url: process.argv[3],
        port: process.argv[4],
        user: process.argv[5],
        password: process.argv[6],
        serverExchange: process.argv[7],
        clientExchange: process.argv[8],
    };
}

function getDungeon(dungeonID: string): Dungeon {
    const TestSpecies: CharacterSpecies = new CharacterSpecies(
        '1',
        'Hexer',
        'Hexiger Hexer'
    );
    const TestStartStats: CharacterStats = new CharacterStats(100, 20, 100);
    const TestMaxStats: CharacterStats = new CharacterStats(100, 20, 100);
    const TestGender: CharacterGender = new CharacterGender(
        '1',
        'Mann',
        'Maennlicher Mann'
    );
    const TestClass: CharacterClass = new CharacterClass(
        '1',
        'Magier',
        'Magischer Magier',
        TestMaxStats,
        TestStartStats
    );
    const TestNpc: Npc = new Npc(
        '1',
        'Bernd',
        'Bernd liebt die Musik',
        'Barde'
    );
    const TestItem: Item = new Item('1', 'Apfel', 'Apfliger Apfel');
    const TestConnections: ConnectionInfo = new ConnectionInfo(
        'active',
        'active'
    );
    const TestAction: ActionElement = new ActionElement(
        '1',
        'essen',
        'gegessen',
        'essen aktion',
        [new Event('addhp', 10)],
        ['1']
    );
    const TestRoom: Room = new Room(
        '1',
        'Raum-1',
        'Der Raum in dem alles begann',
        [TestNpc.npcId],
        [TestItem.itemId],
        TestConnections,
        [TestAction.actionId],
        2,
        2
    );
    const TestRoomNorth: Room = new Room(
        '2',
        'Raum-N',
        'Der Raum im Norden',
        [TestNpc.npcId],
        [TestItem.itemId],
        new ConnectionInfo('inactive', 'active'),
        [TestAction.actionId],
        2,
        3
    );
    const TestRoomEast: Room = new Room(
        '3',
        'Raum-O',
        'Der Raum im Osten',
        [TestNpc.npcId],
        [TestItem.itemId],
        new ConnectionInfo('inactive', 'inactive'),
        [TestAction.actionId],
        3,
        2
    );
    const TestRoomSouth: Room = new Room(
        '4',
        'Raum-S',
        'Der Raum im Sueden',
        [TestNpc.npcId],
        [TestItem.itemId],
        new ConnectionInfo('inactive', 'inactive'),
        [TestAction.actionId],
        2,
        1
    );
    const TestRoomWest: Room = new Room(
        '5',
        'Raum-W',
        'Der Raum im Westen',
        [TestNpc.npcId],
        [TestItem.itemId],
        new ConnectionInfo('active', 'inactive'),
        [TestAction.actionId],
        1,
        2
    );
    const TestRoomNorthNorth: Room = new Room(
        '6',
        'Raum-NN',
        'Der Raum im Norden, Norden',
        [TestNpc.npcId],
        [TestItem.itemId],
        new ConnectionInfo('inactive', 'closed'),
        [TestAction.actionId],
        2,
        4
    );
    const TestCharacter: Character = new Character(
        '1',
        '1',
        '1',
        'Jeff',
        'Magier',
        TestSpecies,
        TestGender,
        TestMaxStats,
        TestStartStats,
        TestRoom.roomId,
        [TestItem.itemId]
    );
    const TestCharacterSameRoom: Character = new Character(
        '2',
        '2',
        '1',
        'Spieler',
        'Magier',
        TestSpecies,
        TestGender,
        TestMaxStats,
        TestStartStats,
        TestRoom.roomId,
        [TestItem.itemId]
    );
    const TestCharacterNotSameRoom: Character = new Character(
        '3',
        '3',
        '1',
        'Bob',
        'Magier',
        TestSpecies,
        TestGender,
        TestMaxStats,
        TestStartStats,
        TestRoomNorth.roomId,
        [TestItem.itemId]
    );
    const TestDungeon: Dungeon = new Dungeon(
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
        [TestAction]
    );
    return new Dungeon(
        dungeonID,
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
        [TestAction]
    );
}

main();
