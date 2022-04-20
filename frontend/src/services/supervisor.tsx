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

export interface CharacterStats  {
    maxhp: number,
    hp: number,
    maxdmg: number,
    dmg: number,
    maxmana: number,
    mana: number
}

export interface CharacterClass  {
    id: number;
    name: string;
    description: string;
    maxHp: number;
    maxDmg: number;
    maxMana: number;

}

export interface SupervisorResponse {
    ok: number
}

export interface ErrorResponse extends SupervisorResponse {
    error: string
}


/**
 * Authenticates User via POST: /auth with either a token or password
 */
export interface AuthenticateRequest  {
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
export interface LoginRequest  {
    user: string;
    character: string;
    auth: string;
}

export interface LoginResponse extends SupervisorResponse {}

interface DungeonActionRequest  {
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

export interface GetDungeonsRequest  {
    user: string;
    auth: string;
}

interface DungeonResponseData 
    {
        id: string;
        name: string;
        description: string;
        maxplayercount: number;
        playercount: number;
        status: "online" | "offline";
    }
export type GetDungeonsResponse = DungeonResponseData[]


export interface GetMyDungeonsRequest extends GetDungeonsRequest {}
export interface GetMyDungeonsResponse extends GetDungeonsResponse {}

export interface CreateDungeonRequest  {
    user: string;
    auth: string;
    dungeonData: any; //TODO: define Dungeon
}

export interface CreateDungeonResponse extends SupervisorResponse {}

export interface EditDungeonRequest extends CreateDungeonRequest { dungeon: string }
export interface EditDungeonResponse extends CreateDungeonResponse {}

export interface DeleteDungeonRequest  {
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

export type GetDungeonDataRequest = DungeonDataResponseData[];

export interface GetDungeonDataResponse  {
    classes: [{id:string, name: string, description: string}]; // TODO: define class
    species: [{ id: string, name: string, description: string }]; // TODO: define species
    genders: [{ id: string, name: string, description: string }]; // TODO: define gender
}

export interface GetCharactersRequest extends GetDungeonDataRequest {}
export interface GetCharactersResponseData
    {
        character: string;
        name: string;
        class: string;
    }
export type GetCharactersResponse = GetCharactersResponseData[]

export interface CreateCharacterRequest  {
    user: string;
    auth: string;
    character: any; //TODO: define Character
}

export interface CreateCharacterResponse extends SupervisorResponse { }

export type GetDataType = 'dungeons' | 'mydungeons' | 'characters' | 'dungeonData'

const supervisor = {
    getDungeons(body:GetDungeonsRequest, dataCallBack: (data: GetDungeonsResponse)=>void, error: (error: ErrorResponse)=>void){
        let data: GetDungeonsResponse = [
            {
                id: "1",
                name: "Test Dungeon",
                description: "This is a test dungeon",
                maxplayercount: 10,
                playercount: 0,
                status: "online"
            },
            {
                id: "2",
                name: "Test Dungeon 2",
                description: "This is a test dungeon",
                maxplayercount: 10,
                playercount: 0,
                status: "offline"
            }];
        dataCallBack(data);
        return;
        fetch(connectionString + "/dungeons", {
            method: 'GET',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    getMyDungeons(body:GetMyDungeonsRequest, dataCallBack: (data: GetMyDungeonsResponse)=>void, error: (error: ErrorResponse)=>void){
        let data: GetMyDungeonsResponse = [
            {
                id: "1",
                name: "Test Dungeon",
                description: "This is a test dungeon",
                maxplayercount: 10,
                playercount: 0,
                status: "online"
            }];
        dataCallBack(data);
        return;
        fetch(connectionString + "/myDungeons", {
            method: 'GET',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    getCharacters(body:GetCharactersRequest, dataCallBack: (data: GetCharactersResponse)=>void, error: (error: ErrorResponse)=>void){
        let data: GetCharactersResponse = [
            {
                character: "1",
                name: "Test Character",
                class: "1"
            }
        ]
        ;
        dataCallBack(data);
        return;
        fetch(connectionString + '/getCharacters', {
            method: 'GET',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    getDungeonData(body:GetDungeonDataRequest, dataCallBack: (data: GetDungeonDataResponse)=>void, error: (error: ErrorResponse)=>void){
        let data: GetDungeonDataResponse = {
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
                    id:"2",
                    name: "Test gender",
                    description: "This is a test gender"
                }
            ]
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/dungeonData', {
            method: 'GET',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    

}

export { supervisor };