import "src/types/supervisor";
import { GetDungeonsRequest, GetDungeonsResponse, ErrorResponse, GetMyDungeonsRequest, GetMyDungeonsResponse, GetCharactersRequest, GetCharactersResponse, GetCharacterAttributesRequest, GetCharacterAttributesResponse, AuthenticateRequest, AuthenticateResponse, LoginRequest, LoginResponse, StartDungeonRequest, StartDungeonResponse, StopDungeonRequest, StopDungeonResponse, CreateDungeonRequest, CreateDungeonResponse, EditDungeonRequest, EditDungeonResponse, DeleteDungeonRequest, DeleteDungeonResponse, CreateCharacterRequest, CreateCharacterResponse, GetDungeonRequest, DeleteCharacterResponse, DeleteCharacterRequest, GetDungeonResponse, DungeonResponseData, CharactersResponseData } from "src/types/supervisor";

let connectionString = "";
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    connectionString = "http://localhost:43210"
} else {
    connectionString = process.env.REACT_APP_HOM_API || "https://mud-ga.me:43210";
}
// TODO: connect supervisor to the real supervisor
// REFACTOR: Make it generic
const supervisor = {
    getSearchParamas: (params:any) => {
        return `?${Object.keys(params).map(key => key + '=' + params[key]).join('&')}`;
    },
    getDungeon(dungeonID: string, body: GetDungeonRequest, dataCallBack: (response: GetDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        let data: DungeonResponseData = {
            id: "1",
            name: "Test Dungeon",
            description: "This is a test dungeon",
            maxplayercount: 10,
            playercount: 0,
            status: "online"
        };
        dataCallBack({ ok: 1, dungeon: data });
        return;
        fetch(connectionString + "/dungeons/" + dungeonID, {
            method: 'GET',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => dataCallBack(data)).catch(err => error(err));
    },
    getDungeons(body: GetDungeonsRequest, dataCallBack: (data: GetDungeonsResponse) => void, error: (error: ErrorResponse) => void) {
        fetch(connectionString + "/dungeons" + this.getSearchParamas(body), {
            method: 'GET'
        }).then(res => res.json()).then(data => {
            if (data.ok) {
                dataCallBack(data);
            } else {
                error(data);
            }
        }).catch(err => error(err));
    },
    getMyDungeons(body: GetMyDungeonsRequest, dataCallBack: (data: GetMyDungeonsResponse) => void, error: (error: ErrorResponse) => void) {
        fetch(connectionString + "/myDungeons" + this.getSearchParamas(body), {
            method: 'GET'
                }).then(res => res.json()).then(data => {
            console.log(data);
            if (data.ok) {
                dataCallBack(data);
            } else {
                error(data);
            }
        }).catch(err => error(err));
    },
    getCharacters(dungeonID: string, body: GetCharactersRequest, dataCallBack: (data: CharactersResponseData[]) => void, error: (error: ErrorResponse) => void) {
        fetch(connectionString + '/characters/' + dungeonID + this.getSearchParamas(body) , {
            method: 'GET'
        }).then(res => res.json()).then((data: GetCharactersResponse | ErrorResponse) => {
            console.log(data);
            if (data.ok) {
                dataCallBack((data as GetCharactersResponse).characters);
            } else {
                error((data as ErrorResponse));
            }
        }).catch(err => error(err));
    },
    getCharacterAttributes(dungeonID: string, body: GetCharacterAttributesRequest, dataCallBack: (data: GetCharacterAttributesResponse) => void, error: (error: ErrorResponse) => void) {
        fetch(connectionString + '/character/attributes/' + dungeonID + this.getSearchParamas(body), {}).then(res => res.json()).then(data => {
            console.log(data);
            if (data.ok) {
                dataCallBack(data);
            } else {
                error(data);
            }
        }).catch(err => error(err));
    },
    authenticate(body: AuthenticateRequest, dataCallBack: (data: AuthenticateResponse) => void, error: (error: ErrorResponse) => void) {
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