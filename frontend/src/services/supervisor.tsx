/**
 * @module Supervisor-Service-Interface
 * @description Service interface for the supervisor
 * @author Raphael Sack
 * @category Service
 */

import { GetDungeonsRequest, ErrorResponse, GetMyDungeonsRequest, GetCharactersRequest, GetCharacterAttributesRequest, GetCharacterAttributesResponse, AuthenticateRequest, AuthenticateResponse, LoginRequest, LoginResponse, StartDungeonRequest, StartDungeonResponse, StopDungeonRequest, StopDungeonResponse, CreateDungeonRequest, CreateDungeonResponse, EditDungeonRequest, EditDungeonResponse, DeleteDungeonRequest, DeleteDungeonResponse, CreateCharacterRequest, CreateCharacterResponse, GetDungeonRequest, DeleteCharacterResponse, DeleteCharacterRequest, GetDungeonResponse, DungeonResponseData, CharactersResponseData, LoginResponseData , CheckPasswordResponse, GetAdminDungeonListRequest, AdminDungeonListResponse} from "@supervisor/api";
import $ from "jquery";

let connectionString = "";
if (!process.env.NODE_ENV || !process.env.REACT_APP_HOM_API && process.env.NODE_ENV === 'development') {
    connectionString = "http://localhost:43210"
} else {
    connectionString = process.env.REACT_APP_HOM_API || "https://mud-ga.me:43210";
}
/**
 * 
 * @param path Path to the leading resource, starting after the connection string (e.g. /api/dungeons)
 * @param params Params in key-value pairs
 * @param dataCallBack Callback function to handle the data
 * @param error Callback function to handle the error
 * @param unpackKey Object key, if the data is packed object (e.g. {data:..., ok:0}) you can specify the key of the data to retrieve it in dataCallBack
 */
const genericGet = (path: string, params: { [key: string]: any }, dataCallBack: (response: any) => void, error: (error: ErrorResponse) => void, unpackKey?: string) => {
    $.ajax(connectionString + path + getSearchParamas(params), {
        method: 'GET',
        dataType: 'json',
        contentType: "text/plain",
        xhrFields: {
            withCredentials: true
        },
        success: (data: any) => {
            if (data.ok) {
                unpackKey || dataCallBack(data);
                unpackKey && dataCallBack(data[unpackKey]);
            } else {
                error(data as unknown as ErrorResponse);
            }
        },
        error: (xhr, errorText, errorThrown) => {
            error({ ok: 0, error: xhr.responseJSON.error });
        }
    });
}

/**
 * 
 * @param path Path to the leading resource, starting after the connection string (e.g. /api/dungeons)
 * @param method HTTP-Method (e.g. GET, POST, PUT, DELETE)
 * @param body Request body
 * @param params search params as an object
 * @param dataCallBack Callback function that handles the data that comes back
 * @param error Callback function that handles the error
 * @param unpackKey If the data is packed in an object, you can specify the key of the data to retrieve it in dataCallBack (e.g. {data:..., ok:0}) => unpackKey = 'data'
 */
const genericRequest = (path: string, method: string, body: {}, params: { [key: string]: any }, dataCallBack: (response: any) => void, error: (error: ErrorResponse) => void, unpackKey?: string) => {
    let par = params ? getSearchParamas(params) : "";
    $.ajax(connectionString + path + par, {
        method: method,
        dataType: 'json',
        data: JSON.stringify(body),
        contentType: "application/json",
        xhrFields: {
            withCredentials: true
        },
        success: (data: any) => {
            if (data.ok) {
                unpackKey || dataCallBack(data);
                unpackKey && dataCallBack(data[unpackKey]);
            } else {
                error(data as unknown as ErrorResponse);
            }
        },
        error: (xhr, errorText, errorThrown) => {
            error({ ok: 0, error: xhr.responseJSON.error });
        }
    });
}

/**
 * 
 * @param params search params as an object in key-value pairs (e.g. {name: 'test', maxPlayers: '10'})
 * @returns String with the search params (e.g ?name=test&maxPlayers=10)
 */
const getSearchParamas = (params: any) => {
    return `?${Object.keys(params).map(key => key + '=' + params[key]).join('&')}`;
}


const supervisor = {
    getDungeon(dungeonID: string, body: GetDungeonRequest, dataCallBack: (response: GetDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        genericGet(`/dungeon/${dungeonID}`, body, dataCallBack, error, "dungeon");
    },

    getDungeons(body: GetDungeonsRequest, dataCallBack: (data: DungeonResponseData[]) => void, error: (error: ErrorResponse) => void) {
        genericGet("/dungeons", body, dataCallBack, error, "dungeons");
    },

    getMyDungeons(body: GetMyDungeonsRequest, dataCallBack: (data: DungeonResponseData[]) => void, error: (error: ErrorResponse) => void) {
        genericGet('/mydungeons', body, dataCallBack, error, "dungeons");
    },

    getAdminDungeonList(body: GetAdminDungeonListRequest, dataCallBack: (data: AdminDungeonListResponse) => void, error: (error: ErrorResponse) => void) {
        genericGet('/adminDungeonList', body, dataCallBack, error, "dungeons");
    },

    getCharacters(dungeonID: string, body: GetCharactersRequest, dataCallBack: (data: CharactersResponseData[]) => void, error: (error: ErrorResponse) => void) {
        genericGet(`/characters/${dungeonID}`, body, dataCallBack, error, "characters");
    },

    getCharacterAttributes(dungeonID: string, body: GetCharacterAttributesRequest, dataCallBack: (data: GetCharacterAttributesResponse) => void, error: (error: ErrorResponse) => void) {
        genericGet(`/character/attributes/${dungeonID}`, body, dataCallBack, error);
    },

    authenticate(body: AuthenticateRequest, dataCallBack: (data: AuthenticateResponse) => void, error: (error: ErrorResponse) => void) {
        genericRequest("/auth/login", "POST", body, {}, dataCallBack, error);
    },

    userLogout(dataCallBack: () => void, error: (error: ErrorResponse) => void) {
        genericRequest("/auth/logout", "POST", {}, {}, dataCallBack, error);
    },

    deleteUser(dataCallBack: (data: LoginResponseData) => void, error: (error: ErrorResponse) => void) {
        genericRequest("/auth/delete", "DELETE", {}, {}, dataCallBack, error);
    },
    register(email: string, user: string, password: string, dataCallBack: (data: LoginResponse) => void, error: (error: ErrorResponse) => void) {
        genericRequest("/auth/register", "POST", { email, user, password }, {}, dataCallBack, error);
    },

    verify(token: string, dataCallBack: (data: LoginResponse) => void, error: (error: ErrorResponse) => void) {
        genericRequest("/auth/verify", "POST", { token: token }, {}, dataCallBack, error);
    },

    requestResetPassword(email: string, dataCallBack: (data: LoginResponse) => void, error: (error: ErrorResponse) => void) {
        genericRequest("/auth/requestpassword", "POST", { email }, {}, dataCallBack, error);
    },

    changePassword(token: string, password:string, dataCallBack: (data: LoginResponse) => void, error: (error: ErrorResponse) => void) {
        genericRequest("/auth/resetpassword", "POST", { token, password }, {}, dataCallBack, error);
    },

    checkPassword(dungeonID: string, password: string, dataCallBack: (data: CheckPasswordResponse) => void, error: (error: ErrorResponse) => void) {
        genericRequest(`/checkPassword/${dungeonID}`, "POST", {password}, {}, dataCallBack, error);
    },

    login(dungeonID: string, body: LoginRequest, dataCallBack: (data: LoginResponseData) => void, error: (error: ErrorResponse) => void) {
        genericRequest(`/login/${dungeonID}`, "POST", body, {}, dataCallBack, error);
    },

    startDungeon(dungeonID: string, body: StartDungeonRequest, dataCallBack: (data: StartDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        genericRequest(`/startDungeon/${dungeonID}`, "POST", body, {}, dataCallBack, error);
    },

    stopDungeon(dungeonID: string, body: StopDungeonRequest, dataCallBack: (data: StopDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        genericRequest(`/stopDungeon/${dungeonID}`, "POST", body, {}, dataCallBack, error);
    },

    createDungeon(body: CreateDungeonRequest, dataCallBack: (data: CreateDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        genericRequest(`/dungeon`, "POST", body, {}, dataCallBack, error);
    },
    editDungeon(dungeonID: string, body: EditDungeonRequest, dataCallBack: (data: EditDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        genericRequest(`/dungeon/${dungeonID}`, "PATCH", body, {}, dataCallBack, error);
    },
    deleteDungeon(dungeonID: string, body: DeleteDungeonRequest, dataCallBack: (data: DeleteDungeonResponse) => void, error: (error: ErrorResponse) => void) {
        genericRequest(`/dungeon/${dungeonID}`, "DELETE", body, {}, dataCallBack, error);

    },
    createCharacter(dungeonID: string, body: CreateCharacterRequest, dataCallBack: (data: CreateCharacterResponse) => void, error: (error: ErrorResponse) => void) {
        genericRequest(`/character/${dungeonID}`, "POST", body, {}, dataCallBack, error);
    },
    deleteCharacter(dungeonID: string, body: DeleteCharacterRequest, dataCallBack: (data: DeleteCharacterResponse) => void, error: (error: ErrorResponse) => void) {
        genericRequest(`/character/${dungeonID}`, "DELETE", body, {}, dataCallBack, error);
    }
}

export { supervisor };