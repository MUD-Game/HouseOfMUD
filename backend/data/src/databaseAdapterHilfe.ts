import { DatabaseAdapter } from "./databaseAdapter";
import { DungeonDataset } from "./datasets/dungeonDataset";

const testDungeon: DungeonDataset = {
    name: "DatabaseTestDungeon",
    description: "This dungeon's only purpose is to test the database",
    creatorId: "",
    masterId: "",
    maxPlayers: 17,
    characters: [],
    characterClasses: [
        {
            id: "class1",
            name: "firstclass",
            description: "the only existing class",
            maxStats: {
                hp: 10,
                dmg: 10,
                mana: 10
            },
            startStats: {
                hp: 5,
                dmg: 5,
                mana: 5
            }
        }
    ],
    characterSpecies: [
        {
            id: "species1",
            name: "human",
            description: "the worst of all species"
        }
    ],
    characterGenders: [
        {
            id: "gender1",
            name: "diverse",
            description: ""
        }
    ],
    rooms: [
        {
            id: "room1",
            name: "the only room",
            description: "",
            npcs: [
                "npc1"
            ],
            items: [
                {
                    item: "item1",
                    count: 1
                }
            ],
            connections: {
                east: "closed",
                south: "closed"
            },
            actions: [
                "action1"
            ],
            xCoordinate: 1,
            yCoordinate: 1
        }
    ],
    items: [
        {
            id: "item1",
            name: "sword",
            description: "sharp as hell"
        }
    ],
    npcs: [
        {
            id: "npc1",
            name: "gertrud",
            description: "protective animal",
            species: "nil goose"
        }
    ],
    blacklist: [],
    actions: []
}

async function execute() {
    let databaseAdapter: DatabaseAdapter = new DatabaseAdapter("mongodb://127.0.0.1:27017", "test")
    //console.log(await databaseAdapter.storeDungeon(testDungeon))
    let receivedDungeon = await databaseAdapter.getDungeon("627034b9e0fb3898fde88bab")
    // console.log(await databaseAdapter.getAllCharactersFromUserInDungeon("test1", "626aa3eea8183b0a09d74bc3"))
    // console.log(await databaseAdapter.getCharacterById("test2"))
    console.log(receivedDungeon?.rooms[0].items)
}

execute()