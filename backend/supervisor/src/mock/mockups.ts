import {
    GetDungeonResponse,
    GetDungeonsResponse,
    GetMyDungeonsResponse,
    GetCharacterAttributesResponse,
    GetCharactersResponse,
    DungeonResponseData,
    CharactersResponseData
} from '../types/api';

export interface MockResponse {
    getalldungeons: DungeonResponseData[];
    getdungeon: DungeonResponseData;
    getmydungeons: DungeonResponseData[];
    getcharacterattributes: {
        classes: GetCharacterAttributesResponse['classes'];
        genders: GetCharacterAttributesResponse['genders'];
        species: GetCharacterAttributesResponse['species'];
    };
    getcharacters: CharactersResponseData[];
}

const mockresponse: MockResponse = {
    getalldungeons: [
        {
            id: '1',
            name: 'Test Dungeon',
            description: 'This is a test dungeon',
            maxplayercount: 10,
            playercount: 0,
            status: 'online',
        },
        {
            id: '2',
            name: 'Test Dungeon 2',
            description: 'This is a test dungeon',
            maxplayercount: 10,
            playercount: 3,
            status: 'offline',
        },
    ],
    getdungeon: {
        id: '3',
        name: 'Mock Dungeon',
        description: 'This is a test dungeon',
        maxplayercount: 10,
        playercount: 3,
        status: 'online',
    },
    getmydungeons: [
        {
            id: '1',
            name: 'Test Dungeon (My)',
            description: 'This is a test dungeon',
            maxplayercount: 10,
            playercount: 0,
            status: 'online',
        },
        {
            id: '2',
            name: 'Test Dungeon 2 (My)',
            description: 'This is a test dungeon',
            maxplayercount: 10,
            playercount: 3,
            status: 'offline',
        },
    ],
    getcharacterattributes:{
         classes: [
        {
            id: "1",
            name: "Test Class",
            description: "This is a test class"
        }
    ],
    species: [
        {
            id: "1",
            name: "Test Species",
            description: "This is a test species"
        }
    ],
    genders: [
        {
            id: "2",
            name: "Test gender",
            description: "This is a test gender"
        }
    ]
},
    getcharacters: [
            {
                character: "1",
                name: "Test Character",
                class: "Goblin"
            }
        ]
};

export { mockresponse };
