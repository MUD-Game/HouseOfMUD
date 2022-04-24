import { exit } from 'process';
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

    handleHostMessages(dungeonController);
}

function handleHostMessages(dungeonController: DungeonController) {
    process.on('message', async (msg: any) => {
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
                await dungeonController.getAmqpAdapter().close();
                exit(0);
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
        [TestNpc.id],
        [TestItem.id],
        TestConnections,
        [TestAction.id],
        2,
        2
    );
    const TestRoomNorth: Room = new Room(
        '2',
        'Raum-N',
        'Der Raum im Norden',
        [TestNpc.id],
        [TestItem.id],
        new ConnectionInfo('inactive', 'active'),
        [TestAction.id],
        2,
        3
    );
    const TestRoomEast: Room = new Room(
        '3',
        'Raum-O',
        'Der Raum im Osten',
        [TestNpc.id],
        [TestItem.id],
        new ConnectionInfo('inactive', 'inactive'),
        [TestAction.id],
        3,
        2
    );
    const TestRoomSouth: Room = new Room(
        '4',
        'Raum-S',
        'Der Raum im Sueden',
        [TestNpc.id],
        [TestItem.id],
        new ConnectionInfo('inactive', 'inactive'),
        [TestAction.id],
        2,
        1
    );
    const TestRoomWest: Room = new Room(
        '5',
        'Raum-W',
        'Der Raum im Westen',
        [TestNpc.id],
        [TestItem.id],
        new ConnectionInfo('active', 'inactive'),
        [TestAction.id],
        1,
        2
    );
    const TestRoomNorthNorth: Room = new Room(
        '6',
        'Raum-NN',
        'Der Raum im Norden, Norden',
        [TestNpc.id],
        [TestItem.id],
        new ConnectionInfo('inactive', 'closed'),
        [TestAction.id],
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
        TestRoom.id,
        [TestItem.id]
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
        TestRoom.id,
        [TestItem.id]
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
        TestRoomNorth.id,
        [TestItem.id]
    );
    const testDungeon: Dungeon = new Dungeon(
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
        [TestAction],
        [TestItem],
        [TestNpc]
    );
    return testDungeon;
}

main();
