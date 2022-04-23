import {
    GetDungeonResponse,
    GetDungeonsResponse,
    GetMyDungeonsResponse,
    GetCharacterAttributesResponse,
    GetCharactersResponse,
    DungeonResponseData,
} from '../types/api';

export interface MockResponse {
    getalldungeons: DungeonResponseData[];
    getdungeon: DungeonResponseData;
    getmydungeons: DungeonResponseData[];
    getcharacterattributes: GetCharacterAttributesResponse;
    getcharacters: GetCharactersResponse;
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
    getcharacterattributes: {} as any,
    getcharacters: {} as any,
};

export { mockresponse };
