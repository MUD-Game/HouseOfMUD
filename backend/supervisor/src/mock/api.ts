import {
    GetDungeonResponse,
    GetDungeonsResponse,
    GetMyDungeonsResponse,
    GetCharacterAttributesResponse,
    GetCharactersResponse,
    DungeonResponseData,
    CharactersResponseData,
    LoginRequest,
    AuthenticateResponse,
    AuthenticateRequest
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

export interface MockAuth {
    authToken: AuthenticateResponse['authToken'];
    user: AuthenticateRequest['user'];
    password: AuthenticateRequest['password'];
}


const mockresponse: MockResponse = {
    getalldungeons: [
        {
            id: '1',
            name: 'Test Dungeon',
            description: 'This is a test dungeon',
            maxPlayers: 10,
            currentPlayers: 0,
            status: 'online',
        },
        {
            id: '2',
            name: 'Test Dungeon 2',
            description: 'This is a test dungeon',
            maxPlayers: 10,
            currentPlayers: 3,
            status: 'offline',
        },
    ],
    getdungeon: {
        id: '3',
        name: 'Mock Dungeon',
        description: 'This is a test dungeon',
        maxPlayers: 10,
        currentPlayers: 3,
        status: 'online',
    },
    getmydungeons: [
        {
            id: '1',
            name: 'Test Dungeon (My)',
            description: 'This is a test dungeon',
            maxPlayers: 10,
            currentPlayers: 0,
            status: 'online',
        },
        {
            id: '2',
            name: 'Test Dungeon 2 (My)',
            description: 'This is a test dungeon',
            maxPlayers: 10,
            currentPlayers: 3,
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

const mockauth: MockAuth = {
    authToken: "2037205720857",
    user: "mockuser",
    password: "mockpassword"
}

export { mockresponse, mockauth };
