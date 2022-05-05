import { exit } from 'process';
import { DatabaseAdapter } from '../data/databaseAdapter';
import { CharacterStats } from '../data/datasets/charcterStats';
import { DungeonDataset } from '../data/datasets/dungeonDataset';
import { ActionElement, ActionElementImpl } from '../data/interfaces/actionElement';
import { ActionEvent, ActionEventImpl } from '../data/interfaces/actionEvent';
import { CharacterClass, CharacterClassImpl } from '../data/interfaces/characterClass';
import { CharacterGender, CharacterGenderImpl } from '../data/interfaces/characterGender';
import { CharacterSpecies, CharacterSpeciesImpl } from '../data/interfaces/characterSpecies';
import { CharacterStatsImpl } from '../data/interfaces/characterStats';
import { ConnectionInfo, ConnectionInfoImpl } from '../data/interfaces/connectionInfo';
import { Dungeon, DungeonImpl } from '../data/interfaces/dungeon';
import { Item, ItemImpl } from '../data/interfaces/item';
import { ItemInfo } from '../data/interfaces/itemInfo';
import { Npc, NpcImpl } from '../data/interfaces/npc';
import { Room, RoomImpl } from '../data/interfaces/room';
import { AmqpAdapter } from "./amqp/amqp-adapter";
import { DungeonController } from "./controller/dungeon-controller";

// import { Dungeon } from '../../../data/src/datasets/dungeon'

const dungeonID = process.argv[2];
// const dungeonID = "626d1be8bd7036c89704263d";

interface Tokens {
    [userID: string]: {
        [character: string]: string;
    };
}

const userTokens: Tokens = {};

function sendToHost(hostAction: string, data: any): void {
    if (process.send) {
        process.send({
            host_action: hostAction,
            data: data
        });
    }
}

async function main() {
    console.log(`Starting Dungeon ${dungeonID}`);
    // TODO: get Dungeon from database
    const mongoConnString: string = process.argv[9];
    const database: string = process.argv[10];
    const dba: DatabaseAdapter = new DatabaseAdapter(mongoConnString, database);
    let databaseDungeon: DungeonDataset | undefined = (await dba.getDungeon(dungeonID))
    let dungeon: Dungeon = translateDungeonFromDatabase(databaseDungeon)
    // let dungeon: Dungeon = getDungeon(dungeonID);

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
        dba,
        dungeon
    );
    dungeonController.init();

    handleHostMessages(dungeonController);

    console.log(`Dungeon ${dungeonID} started`);

    sendToHost('started', {});

}

function handleHostMessages(dungeonController: DungeonController) {
    process.on('message', async (msg: any) => {
        let action = msg.action;
        let data = msg.data;

        switch (action) {
            case 'setCharacterToken':
                let userID = data.user;
                let character = data.character;
                let verifyToken = data.verifyToken;

                if (!(userID in userTokens)) {
                    userTokens[userID] = {};
                }

                userTokens[userID][character] = verifyToken;
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

function translateDungeonFromDatabase(databaseDungeon: DungeonDataset | undefined): Dungeon {
    if (databaseDungeon === undefined) {
        throw new Error("The dungeon does not exist!")
    } else {
        let dungeonRooms: Room[] = translateRoomsFromDatabase(databaseDungeon)
        let dungeonActions: ActionElement[] = translateActionsFromDatabase(databaseDungeon)
        let dungeonItems: Item[] = translateItemsFromDatabase(databaseDungeon)
        let dungeonNpcs: Npc[] = translateNpcsFromDatabase(databaseDungeon)
        let dungeonClasses: CharacterClass[] = translateClassesFromDatabase(databaseDungeon)
        let dungeonObject: Dungeon = new DungeonImpl(dungeonID, databaseDungeon?.name, databaseDungeon?.description, databaseDungeon?.creatorId, databaseDungeon?.masterId, databaseDungeon?.maxPlayers, 0, databaseDungeon?.characterSpecies, databaseDungeon?.characterClasses, databaseDungeon?.characterGenders, [], dungeonRooms, databaseDungeon?.blacklist, dungeonActions, dungeonItems, dungeonNpcs,databaseDungeon?.globalActions )
        return dungeonObject
    }
}

function translateRoomsFromDatabase(dungeonFromDatabase: DungeonDataset): Room[] {
    let rooms: Room[] = []
    dungeonFromDatabase.rooms.forEach(databaseRoom => {
        rooms.push(new RoomImpl(databaseRoom.id, databaseRoom.name, databaseRoom.description, databaseRoom.npcs, databaseRoom.items, databaseRoom.connections, databaseRoom.actions, databaseRoom.xCoordinate, databaseRoom.yCoordinate))
    });
    return rooms
}

function translateActionsFromDatabase(dungeonFromDatabase: DungeonDataset): ActionElement[] {
    let actions: ActionElement[] = []
    dungeonFromDatabase.actions.forEach(databaseAction => {
        let actionEvents: ActionEvent[] = [];
        databaseAction.events.forEach(databaseActionEvent => {
            if (databaseActionEvent.eventType === "additem" || "removeItem" || "addhp" || "removehp" || "adddmg" || "removedmg" || "addmana" || "removemana") {
                actionEvents.push(new ActionEventImpl(databaseActionEvent.eventType as "additem" | "removeItem" | "addhp" | "removehp" | "adddmg" | "removedmg" | "addmana" | "removemana", databaseActionEvent.value))
            } else {
                throw new Error('ActionEvent has wrong event type')
            }
        })
        actions.push(new ActionElementImpl(databaseAction.id, databaseAction.command, databaseAction.output, databaseAction.description, actionEvents, databaseAction.itemsneeded))
    })
    return actions
}

function translateItemsFromDatabase(dungeonFromDatabase: DungeonDataset): Item[] {
    let items: Item[] = []
    dungeonFromDatabase.items.forEach(databaseItem => {
        items.push(new ItemImpl(databaseItem.id, databaseItem.name, databaseItem.description))
    });
    return items
}

function translateNpcsFromDatabase(dungeonFromDatabase: DungeonDataset): Npc[] {
    let npcs: Npc[] = []
    dungeonFromDatabase.npcs.forEach(databaseNpc => {
        npcs.push(new NpcImpl(databaseNpc.id, databaseNpc.name, databaseNpc.description, databaseNpc.species))
    });
    return npcs
}

function translateClassesFromDatabase(dungeonFromDatabase: DungeonDataset): CharacterClass[] {
    let characterClasses: CharacterClass[] = []
    dungeonFromDatabase.characterClasses.forEach(databaseCharacterClass => {
        characterClasses.push(new CharacterClassImpl(databaseCharacterClass.id, databaseCharacterClass.name, databaseCharacterClass.description, databaseCharacterClass.maxStats, databaseCharacterClass.startStats))
    })
    return characterClasses;
}

// function getDungeon(dungeonID: string): Dungeon {
//     const TestSpecies: CharacterSpecies = new CharacterSpeciesImpl(
//         '1',
//         'Hexer',
//         'Hexiger Hexer'
//     );
//     const TestStartStats: CharacterStats = new CharacterStatsImpl(100, 20, 100);
//     const TestMaxStats: CharacterStats = new CharacterStatsImpl(100, 20, 100);
//     const TestGender: CharacterGender = new CharacterGenderImpl(
//         '1',
//         'Mann',
//         'Maennlicher Mann'
//     );
//     const TestClass: CharacterClass = new CharacterClassImpl(
//         '1',
//         'Magier',
//         'Magischer Magier',
//         TestMaxStats,
//         TestStartStats
//     );
//     const TestNpc: Npc = new NpcImpl(
//         '1',
//         'Bernd',
//         'Bernd liebt die Musik',
//         'Barde'
//     );
//     const TestItem: Item = new ItemImpl('1', 'Apfel', 'Apfliger Apfel');
//     const TestConnections: ConnectionInfo = new ConnectionInfoImpl(
//         'open',
//         'open'
//     );
//     const TestAction: ActionElement = new ActionElementImpl(
//         '1',
//         'essen',
//         'gegessen',
//         'essen aktion',
//         [new ActionEventImpl('addhp', '10')],
//         ['1']
//     );
//     const TestRoom: Room = new RoomImpl(
//         '1',
//         'Raum-1',
//         'Der Raum in dem alles begann',
//         [TestNpc.id],
//         [new ItemInfo(TestItem.id, 1)],
//         TestConnections,
//         [TestAction.id],
//         2,
//         2
//     );
//     const TestRoomNorth: Room = new RoomImpl(
//         '2',
//         'Raum-N',
//         'Der Raum im Norden',
//         [TestNpc.id],
//         [new ItemInfo(TestItem.id, 1)],
//         new ConnectionInfoImpl('inactive', 'open'),
//         [TestAction.id],
//         2,
//         3
//     );
//     const TestRoomEast: Room = new RoomImpl(
//         '3',
//         'Raum-O',
//         'Der Raum im Osten',
//         [TestNpc.id],
//         [new ItemInfo(TestItem.id, 1)],
//         new ConnectionInfoImpl('inactive', 'inactive'),
//         [TestAction.id],
//         3,
//         2
//     );
//     const TestRoomSouth: Room = new RoomImpl(
//         '4',
//         'Raum-S',
//         'Der Raum im Sueden',
//         [TestNpc.id],
//         [new ItemInfo(TestItem.id, 1)],
//         new ConnectionInfoImpl('inactive', 'inactive'),
//         [TestAction.id],
//         2,
//         1
//     );
//     const TestRoomWest: Room = new RoomImpl(
//         '5',
//         'Raum-W',
//         'Der Raum im Westen',
//         [TestNpc.id],
//         [new ItemInfo(TestItem.id, 1)],
//         new ConnectionInfoImpl('open', 'inactive'),
//         [TestAction.id],
//         1,
//         2
//     );
//     const TestRoomNorthNorth: Room = new RoomImpl(
//         '6',
//         'Raum-NN',
//         'Der Raum im Norden, Norden',
//         [TestNpc.id],
//         [new ItemInfo(TestItem.id, 1)],
//         new ConnectionInfoImpl('inactive', 'closed'),
//         [TestAction.id],
//         2,
//         4
//     );
//     // const TestCharacter: Character = new CharacterImpl(
//     //     'Jeff',
//     //     'Jeff',
//     //     '1',
//     //     'Jeff',
//     //     'Magier',
//     //     TestSpecies,
//     //     TestGender,
//     //     TestMaxStats,
//     //     TestStartStats,
//     //     TestRoom.id,
//     //     [TestItem.id]
//     // );
//     // const TestCharacterSameRoom: Character = new CharacterImpl(
//     //     '2',
//     //     '2',
//     //     '1',
//     //     'Spieler',
//     //     'Magier',
//     //     TestSpecies,
//     //     TestGender,
//     //     TestMaxStats,
//     //     TestStartStats,
//     //     TestRoom.id,
//     //     [TestItem.id]
//     // );
//     // const TestCharacterNotSameRoom: Character = new CharacterImpl(
//     //     '3',
//     //     '3',
//     //     '1',
//     //     'Bob',
//     //     'Magier',
//     //     TestSpecies,
//     //     TestGender,
//     //     TestMaxStats,
//     //     TestStartStats,
//     //     TestRoomNorth.id,
//     //     [TestItem.id]
//     // );
//     const testDungeon: Dungeon = new DungeonImpl(
//         dungeonID,
//         'TestDungeon1',
//         'Test',
//         '1',
//         '1',
//         2,
//         1,
//         [TestSpecies],
//         [TestClass],
//         [TestGender],
//         // [TestCharacter, TestCharacterSameRoom, TestCharacterNotSameRoom],
//         [],
//         [
//             TestRoom,
//             TestRoomNorth,
//             TestRoomEast,
//             TestRoomSouth,
//             TestRoomWest,
//             TestRoomNorthNorth,
//         ],
//         ['abc'],
//         [TestAction],
//         [TestItem],
//         [TestNpc]
//     );
//     return testDungeon;
// }

main();
