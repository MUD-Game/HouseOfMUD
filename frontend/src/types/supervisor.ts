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

export interface CharacterStats {
    maxhp: number;
    hp: number;
    maxdmg: number;
    dmg: number;
    maxmana: number;
    mana: number;
}

export interface CharacterClass {
    id: number;
    name: string;
    description: string;
    maxHp: number;
    maxDmg: number;
    maxMana: number;
}
export interface SupervisorResponse {
    ok: number;
}

export interface ErrorResponse extends SupervisorResponse {
    error: string;
}

/**
 * Authenticates User via POST: /auth with either a token or password
 */
export interface AuthenticateRequest {
    user: string;
    password?: string;
    token?: string;
}

export interface AuthenticateResponse extends SupervisorResponse {
    authToken: string;
}

/**
 * Login to a dungeon via POST: /login/:dungeonId
 */
export interface LoginRequest {
    user: string;
    character: string;
    auth: string;
}

export interface LoginResponse extends SupervisorResponse {}

interface DungeonActionRequest {
    user: string;
    dungeon: string;
    auth: string;
}
/**
 * Starts a dungeon via POST: /startDungeon
 */
export interface StartDungeonRequest {
    user: string;
    dungeon: string;
    auth: string;
}
export interface StartDungeonResponse extends SupervisorResponse {}
/**
 * Stops a dungeon via POST: /stopDungeon
 */
export interface StopDungeonRequest extends DungeonActionRequest {}
export interface StopDungeonResponse extends SupervisorResponse {}

export interface GetDungeonsRequest {
    user: string;
    auth: string;
}

interface DungeonResponseData {
    id: string;
    name: string;
    description: string;
    maxplayercount: number;
    playercount: number;
    status: 'online' | 'offline';
}
export type GetDungeonsResponse = DungeonResponseData[];

export interface GetMyDungeonsRequest extends GetDungeonsRequest {}
export interface GetMyDungeonsResponse extends GetDungeonsResponse {}

export interface CreateDungeonRequest {
    user: string;
    auth: string;
    dungeonData: any; //TODO: define Dungeon
}

export interface CreateDungeonResponse extends SupervisorResponse {}

export interface EditDungeonRequest extends CreateDungeonRequest {
    dungeon: string;
}
export interface EditDungeonResponse extends CreateDungeonResponse {}

export interface DeleteDungeonRequest {
    user: string;
    auth: string;
    dungeon: string;
}
export interface DeleteDungeonResponse extends SupervisorResponse {}

export interface DungeonDataResponseData {
    user: string;
    auth: string;
    dungeon: string;
}

export type GetDungeonDataRequest = {
    user: string;
    auth: string;
    dungeon: string;
};

export interface GetDungeonDataResponse {
    classes: [{ id: string; name: string; description: string }]; // TODO: define class
    species: [{ id: string; name: string; description: string }]; // TODO: define species
    genders: [{ id: string; name: string; description: string }]; // TODO: define gender
}

export interface GetCharactersRequest extends GetDungeonDataRequest {}
export interface GetCharactersResponseData {
    character: string;
    name: string;
    class: string;
}
export type GetCharactersResponse = GetCharactersResponseData[];

export interface CreateCharacterRequest {
    user: string;
    auth: string;
    dungeon: string;
    character: {
        name: string;
        fullname: string;
        class: string;
        species: string;
        gender: string;
    }; //TODO: define Character
}

export interface CreateCharacterResponse extends SupervisorResponse {}

export type GetDataType =
    | 'dungeons'
    | 'mydungeons'
    | 'characters'
    | 'dungeonData';
