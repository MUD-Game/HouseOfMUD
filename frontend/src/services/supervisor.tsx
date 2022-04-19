const connectionString = process.env.REACT_APP_HOM_API;

export type Character = {
    id: number;
    player: string;
    name: string;
    fullname: string;
    stats: CharacterStats;
    class: number;
    species: string;
    gender: string;
};

export type CharacterStats = {
    maxhp: number,
    hp: number,
    maxdmg: number,
    dmg: number,
    maxmana: number,
    mana: number
}

/**
 * Authenticates User via POST: /auth with either a token or password
 */
export type AuthenticateRequest = {
    user: string;
    password: string;
} | {
    user: string;
    token: string;
}

export type AuthenticateResponse = {
    ok: 1;
    authToken: string;
}

/**
 * Login to a dungeon via POST: /login/:dungeonId
 */
export type LoginRequest = {
    user: string;
    character: string;
    auth: string;
}

type OkResponse = {
    ok: 1;
}

export type LoginResponse = OkResponse




type DungeonActionRequest = {
    user: string;
    dungeon: string;
    auth: string;
}
/**
 * Starts a dungeon via POST: /startDungeon
 */
export type StartDungeonRequest = DungeonActionRequest
export type StartDungeonResponse = OkResponse
/**
 * Stops a dungeon via POST: /stopDungeon
 */
export type StopDungeonRequest = DungeonActionRequest
export type StopDungeonResponse = OkResponse

export type GetDungeonsRequest = {
    user: string;
    auth: string;
}

type DungeonResponseData =
    {
        id: string;
        name: string;
        description: string;
        maxplayercount: number;
        playercount: number;
        status: "online" | "offline";
    }
export type GetDungeonsResponse = DungeonResponseData[]


export type GetMyDungeonsRequest = GetDungeonsRequest
export type GetMyDungeonsResponse = GetDungeonsResponse

export type CreateDungeonRequest = {
    user: string;
    auth: string;
    dungeonData: any; //TODO: define Dungeon
}

export type CreateDungeonResponse = OkResponse

export type EditDungeonRequest = CreateDungeonRequest & { dungeon: string }
export type EditDungeonResponse = CreateDungeonResponse

export type DeleteDungeonRequest = {
    user: string;
    auth: string;
    dungeon: string;
}
export type DeleteDungeonResponse = OkResponse

export type GetDungeonDataRequest = {
    user: string;
    auth: string;
    dungeon: string;
}

export type GetDungeonDataResponse = {
    classes: [any]; // TODO: define class
    species: [any]; // TODO: define species
    genders: [any]; // TODO: define gender
}

export type GetCharactersRequest = GetDungeonDataRequest
export type GetCharactersResonse = [
    {
        character: string;
        name: string;
        class: string;
    }
]

export type CreateCharacterRequest = {
    user: string;
    auth: string;
    character: any; //TODO: define Character
}

export type CreateCharacterResponse = OkResponse


const supervisor = {
    getAllDungeons(dataCallback: (data: GetDungeonsResponse) => void, error: (error: string) => void) {
        let data = [
            {
                id: "1",
                name: "Static-Dungeon",
                description: "A static dungeon",
                maxplayercount: 10,
                playercount: 0,
                status: 'online',
            } 
        ] as GetDungeonsResponse ;
        dataCallback(data);
    },
    getMyDungeons(dataCallback: (data: GetMyDungeonsResponse) => void, error: (error: string) => void) {
        let data = [
            {
                id: "1",
                name: "Static-Dungeon",
                description: "A static dungeon",
                maxplayercount: 10,
                playercount: 0,
                status: "online",
            } 
        ] as GetMyDungeonsResponse;
        dataCallback(data);

    },
    getAllCharacters(dungeonId: string, characterId: string, dataCallback: (data: Character[]) => void, error: (error: string) => void) {
        fetch(`${connectionString}/dungeons/${dungeonId}/characters`)
    }
}

export { supervisor };