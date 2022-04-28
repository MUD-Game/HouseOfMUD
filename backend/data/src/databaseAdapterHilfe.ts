import { DatabaseAdapter } from "./databaseAdapter";

const TestDungeon = {
    id: "dungeon1",
    name: "Dungeon",
    description: "this is the best dungeon ever",
    creatorId: "user1",
    masterId: "user1",
    maxPlayers: 0,
    currentPlayers: 0,
    characters: [],
    characterClasses: [],
    characterSpecies: [],
    characterGenders: [],
    rooms: [],
    items: [
        {
            id: "item1",
            name: "Schwert",
            description: "desc"
        },
        {
            id: "item2",
            name: "Schild",
            description: "desc"
        }
    ],
    npcs: [],
    blacklist: [],
    actions: [
        {
            id: "action1",
            command: "eat apple",
            output: "mmmmmmmmmh lecker lecker lecker",
            description: "friss du sau",
            events: [
                {
                    eventType: "addhp",
                    value: "10"
                }
            ],
            itemsneeded: [
                "item1"
            ]
        }
    ]
}

async function execute() {
    let databaseAdapter: DatabaseAdapter = new DatabaseAdapter("mongodb://127.0.0.1:27017", "test")
    //console.log(await databaseAdapter.storeDungeon(TestDungeon))
    let receivedDungeon = await databaseAdapter.getDungeon("626aa3eea8183b0a09d74bc3")
    console.log(await databaseAdapter.getAllCharactersFromUserInDungeon("test1", "626aa3eea8183b0a09d74bc3"))
    console.log(await databaseAdapter.getCharacterById("test2"))
    console.log(receivedDungeon)    
}

execute()