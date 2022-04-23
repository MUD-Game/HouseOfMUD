/**
 * General Supervisor Response-Object. Its sent back to the client and always contains a ok-code.
 * @category Response
 */
export interface SupervisorResponse {
    ok: number;
}

/**
 * General Supervisor Request-Object. Its sent to the server and always contains a authToken
 * @category Request
 */
export interface SupervisorRequest {
    authToken: string;
}

/**
 * Error-Response sent back to the client if there were any errors in the supervisor or the auth failed
 * @category Response
 */
export interface ErrorResponse extends SupervisorResponse {
    error: string;
}

/**
 * Authenticates User via POST: /auth with either a authToken or password
 * @category Request
 */
export interface AuthenticateRequest {
    user: string;
    password?: string;
    authToken?: string;
}

/**
 * Auth-Response is a authToken if the user authenticated with a password
 * @category Response
 */
export interface AuthenticateResponse extends SupervisorResponse {
    authToken: string;
}

/**
 * Login to a dungeon via POST: /login/:dungeonId
 * @category Request
 */
export interface LoginRequest extends SupervisorRequest {
    user: string;
    character: string;
}

/**
 * @category Response
 */
export interface LoginResponse extends SupervisorResponse {
    verifyToken: string;
}

/**
 * Starts a dungeon via POST: /startDungeon/:dungeonId
 * @category Request
 */
export interface StartDungeonRequest extends SupervisorRequest {
    user: string;
}

/**
 * @category Response
 */
export interface StartDungeonResponse extends SupervisorResponse {}

/**
 * Stops a dungeon via POST: /stopDungeon
 * @category Request
 */
export interface StopDungeonRequest {
    user: string;
    authToken: string;
}

/**
 * @category Response
 */
export interface StopDungeonResponse extends SupervisorResponse {}

/**
 * @category Request
 */
export interface GetDungeonsRequest extends SupervisorRequest {
    user: string;
}

/**
 * @category Request
 */
export interface GetDungeonRequest extends SupervisorRequest {
    user: string;
}

/**
 * @category Response
 */
export interface DungeonResponseData {
    id: string;
    name: string;
    description: string;
    maxplayercount: number;
    playercount: number;
    status: 'online' | 'offline';
}
/**
 * @category Response
 */
export interface GetDungeonsResponse extends SupervisorResponse {
    dungeons: DungeonResponseData[];
}

/**
 * @category Response
 */
export interface GetDungeonResponse extends SupervisorResponse {
    dungeon: DungeonResponseData;
}

/**
 * @category Request
 */
export interface GetMyDungeonsRequest extends GetDungeonsRequest {}

/**
 * @category Response
 */
export interface GetMyDungeonsResponse extends GetDungeonsResponse {}

/**
 * @category Request
 */
export interface CreateDungeonRequest extends SupervisorRequest {
    user: string;
    dungeonData: any; //TODO: define Dungeon
}

/**
 * @category Response
 */
export interface CreateDungeonResponse extends SupervisorResponse {}

/**
 * @category Request
 */
export interface EditDungeonRequest extends CreateDungeonRequest {}

/**
 * @category Response
 */
export interface EditDungeonResponse extends CreateDungeonResponse {}

/**
 * @category Request
 */
export interface DeleteDungeonRequest extends SupervisorRequest {
    user: string;
}

/**
 * @category Response
 */
export interface DeleteDungeonResponse extends SupervisorResponse {}

/**
 * @category Request
 */
export interface GetCharacterAttributesRequest extends SupervisorRequest {
    user: string;
}

/**
 * @category Response
 */
export interface GetCharacterAttributesResponse {
    classes: [{ id: string; name: string; description: string }];
    species: [{ id: string; name: string; description: string }];
    genders: [{ id: string; name: string; description: string }];
}

/**
 * @category Request
 */
export interface GetCharactersRequest extends GetCharacterAttributesRequest {}
export interface GetCharactersResponseData {
    character: string;
    name: string;
    class: string;
}

/**
 * @category Response
 */
export type GetCharactersResponse = GetCharactersResponseData[];

/**
 * @category Request
 */
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

/**
 * @category Response
 */
export interface CreateCharacterResponse extends SupervisorResponse {}

/**
 * @category Request
 */
export interface DeleteCharacterRequest extends SupervisorRequest {
    user: string;
    character: string;
}

/**
 * @category Response
 */
export interface DeleteCharacterResponse extends SupervisorResponse {}
