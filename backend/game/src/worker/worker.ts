
import { ActionElement, ActionElementImpl, Character, CharacterClass, CharacterClassImpl, CharacterGender, CharacterGenderImpl, CharacterImpl, CharacterSpecies, CharacterSpeciesImpl, CharacterStats, CharacterStatsImpl, ConnectionInfo, ConnectionInfoImpl, Dungeon, DungeonImpl, Event, EventImpl, Item, ItemImpl, Npc, NpcImpl, Room, RoomImpl } from "../dungeon/dungeon";
import { exit } from 'process';
import { AmqpAdapter } from "./amqp/amqp-adapter";
import { DungeonController } from "./controller/dungeon-controller";


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
        'essen',
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
    // const TestCharacter: Character = new CharacterImpl(
    //     'Jeff',
    //     'Jeff',
    //     '1',
    //     'Jeff',
    //     'Magier',
    //     TestSpecies,
    //     TestGender,
    //     TestMaxStats,
    //     TestStartStats,
    //     TestRoom.id,
    //     [TestItem.id]
    // );
    // const TestCharacterSameRoom: Character = new CharacterImpl(
    //     '2',
    //     '2',
    //     '1',
    //     'Spieler',
    //     'Magier',
    //     TestSpecies,
    //     TestGender,
    //     TestMaxStats,
    //     TestStartStats,
    //     TestRoom.id,
    //     [TestItem.id]
    // );
    // const TestCharacterNotSameRoom: Character = new CharacterImpl(
    //     '3',
    //     '3',
    //     '1',
    //     'Bob',
    //     'Magier',
    //     TestSpecies,
    //     TestGender,
    //     TestMaxStats,
    //     TestStartStats,
    //     TestRoomNorth.id,
    //     [TestItem.id]
    // );
    const testDungeon: Dungeon = new DungeonImpl(
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
        // [TestCharacter, TestCharacterSameRoom, TestCharacterNotSameRoom],
        [],
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
