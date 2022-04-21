import "src/types/supervisor";
import { GetDungeonsRequest, GetDungeonsResponse, ErrorResponse, GetMyDungeonsRequest, GetMyDungeonsResponse, GetCharactersRequest, GetCharactersResponse, GetCharacterAttributesRequest, GetCharacterAttributesResponse, AuthenticateRequest, AuthenticateResponse, LoginRequest, LoginResponse, StartDungeonRequest, StartDungeonResponse, StopDungeonRequest, StopDungeonResponse, CreateDungeonRequest, CreateDungeonResponse, EditDungeonRequest, EditDungeonResponse, DeleteDungeonRequest, DeleteDungeonResponse, CreateCharacterRequest, CreateCharacterResponse, GetDungeonRequest, DeleteCharacterResponse, DeleteCharacterRequest } from "src/types/supervisor";
import { GetDungeonResponse } from '../types/supervisor';


const connectionString = process.env.REACT_APP_HOM_API;

// TODO: connect supervisor to the real supervisor
const supervisor = {
    getDungeon(dungeonID: string, body: GetDungeonRequest, dataCallBack: (response: GetDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        let data: GetDungeonResponse = {
            id: "1",
            name: "Test Dungeon",
            description: "This is a test dungeon",
            maxplayercount: 10,
            playercount: 0,
            status: "online"
        };
        dataCallBack(data);
        return;
        fetch(connectionString + "/dungeons/" + dungeonID, {
            method: 'GET',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    getDungeons(body: GetDungeonsRequest, dataCallBack: (data: GetDungeonsResponse) => void, error: (error: ErrorResponse) => void) {
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
    getMyDungeons(body: GetMyDungeonsRequest, dataCallBack: (data: GetMyDungeonsResponse) => void, error: (error: ErrorResponse) => void) {
        let data: GetMyDungeonsResponse = [
            {
                id: "1",
                name: "Test My Dungeon ",
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
    getCharacters(dungeonID: string, body: GetCharactersRequest, dataCallBack: (data: GetCharactersResponse) => void, error: (error: ErrorResponse) => void) {
        let data: GetCharactersResponse = [
            {
                character: "1",
                name: "Test Character",
                class: "Goblin"
            }
        ]
            ;
        dataCallBack(data);
        return;
        fetch(connectionString + '/characters/' + dungeonID, {
            method: 'GET',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    getCharacterAttributes(dungeonID: string, body: GetCharacterAttributesRequest, dataCallBack: (data: GetCharacterAttributesResponse) => void, error: (error: ErrorResponse) => void) {
        let data: GetCharacterAttributesResponse = {
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
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/character/attribute/' + dungeonID, {
            method: 'GET',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    authenticate(body: AuthenticateRequest, dataCallBack: (data: AuthenticateResponse) => void, error: (error: ErrorResponse) => void) {
        let data: AuthenticateResponse = {
            ok: 1,
            authToken: "xxx"
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/auth', {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    login(dungeonID: string, body: LoginRequest, dataCallBack: (data: LoginResponse) => void, error: (error: ErrorResponse) => void) {
        let data: LoginResponse = {
            verifyToken: "xxx",
            ok: 1
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/login/' + dungeonID, {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    startDungeon(dungeonID: string, body: StartDungeonRequest, dataCallBack: (data: StartDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        let data: StartDungeonResponse = {
            ok: 1
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/startDungeon/' + dungeonID, {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    stopDungeon(dungeonID: string, body: StopDungeonRequest, dataCallBack: (data: StopDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        let data: StopDungeonResponse = {
            ok: 1
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/stopDungeon/' + dungeonID, {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    createDungeon(body: CreateDungeonRequest, dataCallBack: (data: CreateDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        let data: CreateDungeonResponse = {
            ok: 1
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/dungeon', {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    editDungeon(dungeonID: string, body: EditDungeonRequest, dataCallBack: (data: EditDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        let data: EditDungeonResponse = {
            ok: 1
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/dungeon/' + dungeonID, {
            method: 'PATCH',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    deleteDungeon(dungeonID: string, body: DeleteDungeonRequest, dataCallBack: (data: DeleteDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        let data: DeleteDungeonResponse = {
            ok: 1
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/dungeon/' + dungeonID, {
            method: 'DELETE',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    createCharacter(dungeonID: string, body: CreateCharacterRequest, dataCallBack: (data: CreateCharacterResponse) => void, error: (error: ErrorResponse) => void) {
        let data: CreateCharacterResponse = {
            ok: 1
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/character/' + dungeonID, {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    deleteCharacter(dungeonID: string, body: DeleteCharacterRequest, dataCallBack: (data: DeleteCharacterResponse) => void, error: (error: ErrorResponse) => void) {
        let data: DeleteCharacterResponse = {
            ok: 1
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/character/' + dungeonID, {
            method: 'DELETE',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    }
}

export { supervisor };