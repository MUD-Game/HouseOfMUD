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
export interface SupervisorRequest {}

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
    password: string;
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
    character: string;
}

/**
 * @category Response Data
 */
export interface LoginResponseData {
    verifyToken: string;
}

/**
 * @category Response
 */
export interface LoginResponse extends SupervisorResponse , LoginResponseData {}



/**
 * @category Response Data
 */
 export interface CheckPasswordResponse extends SupervisorResponse{}

/**
 * Starts a dungeon via POST: /startDungeon/:dungeonId
 * @category Request
 */
export interface StartDungeonRequest extends SupervisorRequest {
    // user: string;
}

/**
 * @category Response
 */
export interface StartDungeonResponse extends SupervisorResponse { }

/**
 * Stops a dungeon via POST: /stopDungeon
 * @category Request
 */
export interface StopDungeonRequest {}

/**
 * @category Response
 */
export interface StopDungeonResponse extends SupervisorResponse { }

/**
 * @category Request
 */
export interface GetDungeonsRequest extends SupervisorRequest {}

/**
 * @category Request
 */
export interface GetDungeonRequest extends SupervisorRequest {}

/**
 * @category Response
 */
export interface DungeonResponseData {
    id: string;
    name: string;
    description: string;
    maxPlayers: number;
    currentPlayers: number;
    isPrivate: boolean;
    status: 'online' | 'offline';
}

export interface AdminDungeonListResponse {
    online: {
        [host: string]: DungeonResponseData[]
    }
    offline: DungeonResponseData[]
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
export interface GetMyDungeonsRequest extends GetDungeonsRequest { }

/**
 * @category Request
 */
 export interface GetAdminDungeonListRequest extends GetDungeonsRequest { }

/**
 * @category Response
 */
export interface GetMyDungeonsResponse extends GetDungeonsResponse { }

/**
 * @category Request
 */
export interface CreateDungeonRequest extends SupervisorRequest {
    dungeonData: any;
}

/**
 * @category Response
 */
export interface CreateDungeonResponse extends SupervisorResponse { }

/**
 * @category Request
 */
export interface EditDungeonRequest extends CreateDungeonRequest { }

/**
 * @category Response
 */
export interface EditDungeonResponse extends CreateDungeonResponse { }

/**
 * @category Request
 */
export interface DeleteDungeonRequest extends SupervisorRequest { }

/**
 * @category Response
 */
export interface DeleteDungeonResponse extends SupervisorResponse { }

/**
 * @category Request
 */
export interface GetCharacterAttributesRequest extends SupervisorRequest {}


/**
 * @category Response
 */
export interface GetCharacterAttributesResponse extends SupervisorResponse {
    classes: [{ id: string; name: string; description: string }];
    species: [{ id: string; name: string; description: string }];
    genders: [{ id: string; name: string; description: string }];
}

/**
 * @category Request
 */
export interface GetCharactersRequest extends GetCharacterAttributesRequest { }

/**
 * @category Response Data
 */
export interface CharactersResponseData {
    characterClass: string;
    characterGender: string;
    characterSpecies: string;
    id: string;
    name: string;
    _id: string;
}

/**
 * @category Response
 */
export interface GetCharactersResponse extends SupervisorResponse {
    characters: CharactersResponseData[];
}

/**
 * @category Request
 */
export interface CreateCharacterRequest extends SupervisorRequest {
    characterData: {
        name: string;
        characterClass: string;
        characterSpecies: string;
        characterGender: string;
        position: string;
        inventory: string[];
    };
}

/**
 * @category Response
 */
export interface CreateCharacterResponse extends SupervisorResponse { }

/**
 * @category Request
 */
export interface DeleteCharacterRequest extends SupervisorRequest {
    _id: string;
}

/**
 * @category Response
 */
export interface DeleteCharacterResponse extends SupervisorResponse { }
