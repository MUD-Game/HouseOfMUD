import "src/types/supervisor";
import { GetDungeonsRequest, GetDungeonsResponse, ErrorResponse, GetMyDungeonsRequest, GetMyDungeonsResponse, GetCharactersRequest, GetCharactersResponse, GetDungeonDataRequest, GetDungeonDataResponse, AuthenticateRequest, AuthenticateResponse, LoginRequest, LoginResponse, StartDungeonRequest, StartDungeonResponse, StopDungeonRequest, StopDungeonResponse, CreateDungeonRequest, CreateDungeonResponse, EditDungeonRequest, EditDungeonResponse, DeleteDungeonRequest, DeleteDungeonResponse, CreateCharacterRequest, CreateCharacterResponse } from "src/types/supervisor";


const connectionString = process.env.REACT_APP_HOM_API;

// TODO: connect supervisor to the real supervisor
const supervisor = {
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
    getCharacters(body: GetCharactersRequest, dataCallBack: (data: GetCharactersResponse) => void, error: (error: ErrorResponse) => void) {
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
        fetch(connectionString + '/getCharacters', {
            method: 'GET',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    getDungeonData(body: GetDungeonDataRequest, dataCallBack: (data: GetDungeonDataResponse) => void, error: (error: ErrorResponse) => void) {
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
                    id: "2",
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
    login(body: LoginRequest, dataCallBack: (data: LoginResponse) => void, error: (error: ErrorResponse) => void) {
        let data: LoginResponse = {
            ok: 1
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/login', {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    startDungeon(body: StartDungeonRequest, dataCallBack: (data: StartDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        let data: StartDungeonResponse = {
            ok: 1
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/startDungeon', {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    stopDungeon(body: StopDungeonRequest, dataCallBack: (data: StopDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        let data: StopDungeonResponse = {
            ok: 1
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/stopDungeon', {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    createDungoen(body: CreateDungeonRequest, dataCallBack: (data: CreateDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        let data: CreateDungeonResponse = {
            ok: 1
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/createDungeon', {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    editDungeon(body: EditDungeonRequest, dataCallBack: (data: EditDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        let data: EditDungeonResponse = {
            ok: 1
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/editDungeon', {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    deleteDungeon(body: DeleteDungeonRequest, dataCallBack: (data: DeleteDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        let data: DeleteDungeonResponse = {
            ok: 1
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/deleteDungeon', {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    createCharacter(body: CreateCharacterRequest, dataCallBack: (data: CreateCharacterResponse) => void, error: (error: ErrorResponse) => void) {
        let data: CreateCharacterResponse = {
            ok: 1
        }
        dataCallBack(data);
        return;
        fetch(connectionString + '/createCharacter', {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    }
}

export { supervisor };