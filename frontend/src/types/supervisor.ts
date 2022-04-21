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
 * Authenticates User via POST: /auth with either a authToken or password
 */
export interface AuthenticateRequest {
    user: string;
    password?: string;
    authToken?: string;
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
    authToken: string;
}

export interface LoginResponse extends SupervisorResponse {
    verifyToken: string;
}

/**
 * Starts a dungeon via POST: /startDungeon/:dungeonId
 */
export interface StartDungeonRequest {
    user: string;
    authToken: string;
}
export interface StartDungeonResponse extends SupervisorResponse {}
/**
 * Stops a dungeon via POST: /stopDungeon
 */
export interface StopDungeonRequest {
    user: string;
    authToken: string;
}

export interface StopDungeonResponse extends SupervisorResponse {}

export interface GetDungeonsRequest {
    user: string;
    auth: string;
}

export interface GetDungeonRequest {
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
export type GetDungeonResponse = DungeonResponseData;
export interface GetMyDungeonsRequest extends GetDungeonsRequest {}
export interface GetMyDungeonsResponse extends GetDungeonsResponse {}

export interface CreateDungeonRequest {
    user: string;
    authToken: string;
    dungeonData: any; //TODO: define Dungeon
}

export interface CreateDungeonResponse extends SupervisorResponse {}

export interface EditDungeonRequest extends CreateDungeonRequest {}
export interface EditDungeonResponse extends CreateDungeonResponse {}

export interface DeleteDungeonRequest {
    user: string;
    authToken: string;
}

export interface DeleteDungeonResponse extends SupervisorResponse {}
export type GetCharacterAttributesRequest = {
    user: string;
    auth: string;
};
export interface GetCharacterAttributesResponse {
    classes: [{ id: string; name: string; description: string }];
    species: [{ id: string; name: string; description: string }];
    genders: [{ id: string; name: string; description: string }];
}

export interface GetCharactersRequest extends GetCharacterAttributesRequest {}
export interface GetCharactersResponseData {
    character: string;
    name: string;
    class: string;
}
export type GetCharactersResponse = GetCharactersResponseData[];

export interface CreateCharacterRequest {
    user: string;
    authToken: string;
    characterData: {
        name: string;
        fullname: string;
        class: string;
        species: string;
        gender: string;
    };
}
export interface CreateCharacterResponse extends SupervisorResponse {}

export interface DeleteCharacterRequest {
    user: string;
    authToken: string;
    character: string;
}

export interface DeleteCharacterResponse extends SupervisorResponse {}
