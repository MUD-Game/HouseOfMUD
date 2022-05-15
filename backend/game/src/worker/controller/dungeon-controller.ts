import { ConsumeMessage } from "amqplib";
import { userInfo } from "os";
import { DatabaseAdapter } from "../../data/databaseAdapter";
import { CharacterDataset } from "../../data/datasets/characterDataset";
import { ItemInfo } from "../../data/datasets/itemInfo";
import { Character, CharacterImpl } from "../../data/interfaces/character";
import { CharacterStats, CharacterStatsImpl } from "../../data/interfaces/characterStats";
import { Dungeon } from "../../data/interfaces/dungeon";
import { Room } from "../../data/interfaces/room";
import { ActionHandler, ActionHandlerImpl } from "../action/action-handler";
import { actionMessages, MiniMapData, parseResponseString, triggers } from "../action/actions/action-resources";
import format from "../action/actions/format";
import { DmGiveUpAction } from "../action/dmactions/dmgiveup-action";
import { ToggleConnectionAction } from "../action/dmactions/toggleRoomConnection-action";
import { AmqpAdapter } from "../amqp/amqp-adapter";

export const DUNGEONMASTER = 'dungeonmaster';

function sendToHost(hostAction: string, data: any): void {
    if (process.send) {
        process.send({
            host_action: hostAction,
            data: data
        });
    }
}

interface Tokens {
    [character: string]: string;
}
export class DungeonController {
 
    
    private verifyTokens: Tokens;

    private dungeonID: string;
    private amqpAdapter: AmqpAdapter;
    private databaseAdapter: DatabaseAdapter | null;
    private actionHandler: ActionHandler;
    private dungeon: Dungeon;

    private selectedPlayer: string | undefined;

    constructor(dungeonID: string, amqpAdapter: AmqpAdapter, databaseAdapter: DatabaseAdapter | null, dungeon: Dungeon) {
        this.verifyTokens = {};

        this.dungeonID = dungeonID;
        this.amqpAdapter = amqpAdapter;
        this.databaseAdapter = databaseAdapter;
        this.dungeon = dungeon;

        this.actionHandler = new ActionHandlerImpl(this);
    }

    public init() {
        // comsume messages from clients
        setInterval(() => {
            this.persistAllRooms();
            this.persistAllCharacters();
            this.persistBlacklist();
        }, 300000);
        
        this.handleHostMessages();

        this.amqpAdapter.setCharacterTokenTranslation((character: string) => {
            return this.characterTokenTranslation(character);
        });

        this.amqpAdapter.consume(async (consumeMessage: ConsumeMessage) => {
            try {
                let data = JSON.parse(consumeMessage.content.toString());
                if (data.action !== undefined && data.user !== undefined && data.character !== undefined && data.verifyToken !== undefined && data.data !== undefined) {
                    if (this.verifyTokens[data.character] === data.verifyToken) {
                        this.handleAmqpMessages(data);
                    } else {
                        // kick Player where the character already exists
                        // must directly send action via token because user is not logged in (at this point)
                        this.amqpAdapter.sendActionToToken(data.verifyToken, 'kick', { message: { type: 'alreadyConnected' }});
                    }
                }
            } catch (err) {
                console.log(err);
            }
        });
    }

    characterTokenTranslation(character: string): string | undefined {
        return this.verifyTokens[character];
    }

    private handleHostMessages() {
        process.on('message', async (msg: any) => {
            let action = msg.action;
            let data = msg.data;
            switch (action) {
                case 'setCharacterToken':
                    let character = data.character;
                    if (!(character in this.verifyTokens)) {
                        let verifyToken = data.verifyToken;
                        console.log(`verify ${character}`);
                        this.verifyTokens[character] = verifyToken;
                    }
                    break;
                case 'stop':
                    this.stopDungeon();
                    break;
            }
        });
    }

    private async handleAmqpMessages(data: any) {
        switch (data.action) {
            case 'login':
                let loggedIn: boolean = await this.login(data.user, data.character);
                if (!loggedIn) {
                    this.amqpAdapter.sendActionToToken(data.verifyToken, 'kick', { message: { type: 'internal' }});
                }
                break;
            case 'logout':
                this.logout(data.user, data.character);
                break;
            case 'message':
                this.actionHandler.processAction(data.character, data.data.message);
                // update playerInfo to Dungeon Master in case something has changed
                if (data.character === this.selectedPlayer) {
                    this.sendPlayerInformationData();
                }
                break;
            case 'dmmessage':
                this.actionHandler.processDmAction(data.data.message);
                // update playerInfo to Dungeon Master in case something has changed
                this.sendPlayerInformationData();
                break;
            case 'connection.toggle':
                let toggleConnectionAction: ToggleConnectionAction = this.actionHandler.dmActions[triggers.toggleConnection] as ToggleConnectionAction
                toggleConnectionAction.modifyConnection(data.data.roomId, data.data.direction, data.data.status)
                break;
            case 'playerInformation':
                this.selectedPlayer = data.data.playerName;
                this.sendPlayerInformationData()
                break;
            case 'dmgiveup':
                console.log("dmgiveup", data.data.character);
                let dmgiveupAction : DmGiveUpAction = this.actionHandler.dmActions[triggers.dmgiveup] as DmGiveUpAction
                dmgiveupAction.changeDungeonMaster(data.data.character);
                break;
        }
    }

    private async login(user: string, characterName: string): Promise<boolean> {
        console.log(`login ${characterName}`);
        if(characterName === DUNGEONMASTER && this.getDungeon().getIsMasterless()) {
            this.getDungeon().setIsMasterless(false);
        }
        let character = await this.getCharacter(user, characterName);
        if (character == undefined) {
            return false;
        }
        this.dungeon.characters[characterName] = character;
        await this.amqpAdapter.initClient(characterName);
        if (characterName !== DUNGEONMASTER) {
            await this.amqpAdapter.bindClientQueue(characterName, `room.${character.getPosition()}`);
        }
        this.amqpAdapter.broadcastAction('message', {
            message: `${format.rgb(92, 92, 92)}${format.reset}${format.bold}${format.color.green}→${format.reset}${format.rgb(92, 92, 92)}${format.reset} ${characterName}` });
        this.sendPlayerListToDM();
        sendToHost('dungeonState', { currentPlayers: Object.keys(this.dungeon.characters).length });
        if (characterName !== DUNGEONMASTER) {
            await this.amqpAdapter.sendActionToClient(characterName, "message", {message: parseResponseString(actionMessages.helpMessage, this.dungeon.name, triggers.showActions, triggers.look, triggers.help)})
        } else {
            await this.amqpAdapter.sendActionToClient(characterName, "message", {message: parseResponseString(actionMessages.helpMessageDm, this.dungeon.name, triggers.showDmActions)}) 
        }
        
        await this.sendStatsData(characterName)
        await this.sendMiniMapData(characterName);
        await this.sendInventoryData(characterName);
        return true;
    }

    private async logout(user: string, characterName: string) {
        console.log(`logout ${characterName}`);
        if (!(characterName === DUNGEONMASTER && this.dungeon.getIsMasterless())) {
        delete this.verifyTokens[characterName];
        }
        if (characterName !== DUNGEONMASTER) {
            await this.persistCharacterData(this.dungeon.getCharacter(characterName))
            delete this.dungeon.characters[characterName];
            this.sendPlayerListToDM();
            if(this.selectedPlayer === characterName) {
                this.selectedPlayer = undefined;
                this.sendPlayerInformationData();
            }
            this.amqpAdapter.broadcastAction('message', {
                message: `${format.rgb(92, 92, 92)}${format.reset}${format.bold}${format.color.red}←${format.reset}${format.rgb(92, 92, 92)}${format.reset} ${characterName}`
            });
        } else { // Dungeon Master
            // Check if the dungeonmaster is actually the dungeonmasterid
            if(!this.dungeon.getIsMasterless()) {
            this.stopDungeon();
            }
        }
    }

    public async kickPlayer(character: string, message: any) {
        await this.amqpAdapter.sendActionToClient(character, 'kick', { message: message });
    }

    private async kickAllPlayers(message: any) {
        await this.amqpAdapter.broadcastAction('kick', { message: message });
    }

    sendPlayerListToDM() {
        this.amqpAdapter.sendActionToClient(DUNGEONMASTER, 'updateOnlinePlayers',  {
            players: Object.keys(this.dungeon.characters).map((character: string) => {
                return {
                    character: character,
                    room: this.dungeon.getRoom(this.dungeon.characters[character].position)?.getName()
                }
            })
        });
        this.sendPlayerInformationData();
    }

    async stopDungeon() {
        await this.persistAllCharacters();
        await this.kickAllPlayers({type: 'serverClosed'});
        await this.persistAllRooms();
        await this.getAmqpAdapter().close();
        process.exit(0);
    }

    async persistAllRooms(){
        console.log("persisting rooms...")
        let rooms: Room[] = this.mapToArray(this.dungeon.rooms)
        await this.databaseAdapter?.updateRooms(rooms, this.dungeonID)
    }

    mapToArray(map: any): any[] {
        let array: any[] = [];
        for (let id in map) {
            array.push({ ...map[id], id: id });
        }
        return array;
    }

    async persistAllCharacters(){
        console.log('Persisting all Characters');
        let characters = this.mapToArray(this.dungeon.characters)
        await Promise.all(characters.filter(char => char.name !== DUNGEONMASTER).map(async char => {
            await this.persistCharacterData(char);
        }));
    }

    async persistBlacklist(){
        console.log('Persisting blacklist');
        await this.databaseAdapter?.updateBlacklistInDungeon(this.dungeon.blacklist, this.dungeonID)
    }

    async persistCharacterData(character: Character){
        console.log(`persisting ${character.name}`);
        this.databaseAdapter?.updateCharacterInDungeon({
            name: character.name,
            userId: character.userId,
            dungeonId: this.dungeonID,
            characterClass: character.characterClass,
            characterSpecies: character.characterSpecies,
            characterGender : character.characterGender,
            maxStats: character.maxStats,
            currentStats: character.currentStats,
            position: character.position,
            exploredRooms: Object.keys(character.exploredRooms),
            inventory: character.inventory
        }, this.dungeonID)
    }

    private async getCharacter(user: string, name: string): Promise<Character | undefined> {
        if (this.databaseAdapter) {
            let char = await this.databaseAdapter.getCharacterFromDungeon(name, this.dungeonID);
            console.log(char);
            if (char) {
                let maxStats = char.maxStats;
                let curStats = char.currentStats;
                let exploredRooms:Character['exploredRooms'] = {};
                char.exploredRooms.forEach((room:string) => {
                    if (room in this.dungeon.rooms) {
                        exploredRooms[room] = true;
                    }
                });
                if (!(char.position in this.dungeon.rooms)) {
                    char.position = '0,0'; // Start Room
                }
                char.inventory = this.chekcInventory(char.inventory); // if items were deleted
                return new CharacterImpl(char.userId, char.name, char.characterClass, char.characterSpecies, char.characterGender, new CharacterStatsImpl(maxStats.hp, maxStats.dmg, maxStats.mana), 
                    new CharacterStatsImpl(curStats.hp, curStats.dmg, curStats.mana), char.position, exploredRooms, char.inventory);
            }
        }
        if (name === DUNGEONMASTER) {
            return this.createDungeonMaster(user, name);
        }
    }

    private chekcInventory(inventory: ItemInfo[]): ItemInfo[] {
        let checkedInv: ItemInfo[] = [];
        for (let item of inventory) {
            if (item.item in this.dungeon.items) {
                checkedInv.push(item);
            }
        }
        return checkedInv;
    }

    private createDungeonMaster(user: string, name: string): Character {
        let newCharacter: Character = new CharacterImpl(
            user,
            name,
            '',
            '',
            '',
            new CharacterStatsImpl(0, 0, 0),
            new CharacterStatsImpl(0, 0, 0),
            "0,0",
            {"0,0":true},
            []
        );
        // console.log(this.dungeon)
        return newCharacter;
    }

    getDungeon(): Dungeon {
        return this.dungeon
    }

    getAmqpAdapter(): AmqpAdapter {
        return this.amqpAdapter
    }

    getActionHandler(): ActionHandler {
        return this.actionHandler
    }

    async sendMiniMapData(character: string) {
        let rooms:MiniMapData["rooms"] = {};
        const isDm: boolean = DUNGEONMASTER === character;
        const exploredRooms = this.dungeon.getCharacter(character).exploredRooms;
        for (let room in this.dungeon.rooms) {
            rooms[room] = {
                xCoordinate: this.dungeon.rooms[room].xCoordinate,
                yCoordinate: this.dungeon.rooms[room].yCoordinate,
                connections: this.dungeon.rooms[room].connections,
                explored: exploredRooms[room] || false,
                name: isDm ? this.dungeon.rooms[room].name : undefined
            }
        }
        console.log(this.getDungeon().getCharacter(character).getPosition());
        await this.amqpAdapter.sendActionToClient(character, 'minimap.init', {
                rooms: rooms,
                startRoom:  this.getDungeon().getCharacter(character).getPosition()
            } as MiniMapData);
    }	

    async sendInventoryData(character: string) {
        this.amqpAdapter.sendActionToClient(character, "inventory", this.dungeon.characters[character].inventory.map(item => {
            return { item:this.dungeon.items[item.item].name, count:item.count }
        }));
    }

    async sendStatsData(character: string) {
        let currentCharacterStats: CharacterStats = this.dungeon.characters[character].getCharakterStats()
        let maxCharacterStats: CharacterStats = this.dungeon.characters[character].getMaxStats()
        let data = {
            currentStats: {
                hp: currentCharacterStats.getHp(),
                dmg: currentCharacterStats.getDmg(),
                mana: currentCharacterStats.getMana()
            },
            maxStats: {
                hp: maxCharacterStats.getHp(),
                dmg: maxCharacterStats.getDmg(),
                mana: maxCharacterStats.getMana()
            }
        }
        this.amqpAdapter.sendActionToClient(character, "stats", data);
    }

    public getSelectedPlayer(): String | undefined {
        return this.selectedPlayer;
    }

    async sendPlayerInformationData() {
        if(this.selectedPlayer === undefined){
            this.amqpAdapter.sendActionToClient(DUNGEONMASTER, "updatePlayerInformation", {});
            return;
        }else{

        try {
            let character: Character = this.dungeon.getCharacter(this.selectedPlayer)
            let characterPosition: string = character.getPosition()
            let roomName: string = this.dungeon.rooms[characterPosition].getName()
            let currentCharacterStats: CharacterStats = character.getCharakterStats()
            let maxCharacterStats: CharacterStats = character.getMaxStats()
            let items = character.inventory.map(item => {
                return { item:this.dungeon.items[item.item].name, count:item.count }
            })
            let data = {
                playerName: this.selectedPlayer,
                inventory: items,
                room: roomName,
                currentStats: {
                    hp: currentCharacterStats.getHp(),
                    dmg: currentCharacterStats.getDmg(),
                    mana: currentCharacterStats.getMana()
                },
                maxStats: {
                    hp: maxCharacterStats.getHp(),
                    dmg: maxCharacterStats.getDmg(),
                    mana: maxCharacterStats.getMana()
                }
            }
            this.amqpAdapter.sendActionToClient(DUNGEONMASTER, "updatePlayerInformation", data);
        } catch(e) {
            // console.error(e);
        }      
        }
    }

    getUserIdFromCharacter(character:string){
        return this.dungeon.characters[character].getUserId();
    }

    getDungeonMasterToken(): string{
        return this.verifyTokens[DUNGEONMASTER];
    }

    characterExists(character: string) {
        return character in this.dungeon.characters;
    }
}
