import { DatabaseAdapter } from "../databaseAdapter";
import { Dungeon } from "./dungeon";

const testdungeon: Dungeon = {
    dungeonId: "dungeon1",
    name: "Dungeon",
    description: "this is the best dungeon ever",
    creatorId: "user1",
    masterId: "user1",
    maxPlayers: 0,
    currentPlayers: 0,
    characters: [],
    characterClasses: [],
    characterSpecies: [],
    characterGender: [],
    rooms: [],
    items: [
        {
            itemId: "item1",
            name: "Schwert",
            description: "desc"
        },
        {
            itemId: "item2",
            name: "Schild",
            description: "desc"
        }
    ],
    npcs: [],
    blacklist: [],
    actions: [
        {
            actionId: "action1",
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


const adapter = new DatabaseAdapter("mongodb://127.0.0.1:27017/test")
adapter.storeDungeon(testdungeon)