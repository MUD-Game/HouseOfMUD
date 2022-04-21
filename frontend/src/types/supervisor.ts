/**
 * General Supervisor Response-Object. Its sent back to the client and always contains a ok-code.
 */
export interface SupervisorResponse {
    ok: number;
}

/**
 * General Supervisor Request-Object. Its sent to the server and always contains a authToken
 */
export interface SupervisorRequest {
    authToken: string;
}

/**
 * Error-Response sent back to the client if there were any errors in the supervisor or the auth failed
 */
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

/**
 * Auth-Response is a authToken if the user authenticated with a password
 */
export interface AuthenticateResponse extends SupervisorResponse {
    authToken: string;
}

/**
 * Login to a dungeon via POST: /login/:dungeonId
 */
export interface LoginRequest extends SupervisorRequest {
    user: string;
    character: string;
}
export interface LoginResponse extends SupervisorResponse {
    verifyToken: string;
}

/**
 * Starts a dungeon via POST: /startDungeon/:dungeonId
 */
export interface StartDungeonRequest extends SupervisorRequest {
    user: string;
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

export interface GetDungeonsRequest extends SupervisorRequest {
    user: string;
}

export interface GetDungeonRequest extends SupervisorRequest {
    user: string;
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

export interface CreateDungeonRequest extends SupervisorRequest {
    user: string;
    dungeonData: any; //TODO: define Dungeon
}

export interface CreateDungeonResponse extends SupervisorResponse {}

export interface EditDungeonRequest extends CreateDungeonRequest {}
export interface EditDungeonResponse extends CreateDungeonResponse {}

export interface DeleteDungeonRequest extends SupervisorRequest {
    user: string;
}

export interface DeleteDungeonResponse extends SupervisorResponse {}
export interface GetCharacterAttributesRequest extends SupervisorRequest {
    user: string;
}
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

export interface CreateCharacterRequest extends SupervisorRequest {
    user: string;
    characterData: {
        name: string;
        fullname: string;
        class: string;
        species: string;
        gender: string;
    };
}
export interface CreateCharacterResponse extends SupervisorResponse {}

export interface DeleteCharacterRequest extends SupervisorRequest {
    user: string;
    character: string;
}

export interface DeleteCharacterResponse extends SupervisorResponse {}
