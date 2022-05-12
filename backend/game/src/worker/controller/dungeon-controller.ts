import { ConsumeMessage } from "amqplib";
import { userInfo } from "os";
import { DatabaseAdapter } from "../../data/databaseAdapter";
import { CharacterDataset } from "../../data/datasets/characterDataset";
import { Character, CharacterImpl } from "../../data/interfaces/character";
import { CharacterStats, CharacterStatsImpl } from "../../data/interfaces/characterStats";
import { Dungeon } from "../../data/interfaces/dungeon";
import { Room } from "../../data/interfaces/room";
import { ActionHandler, ActionHandlerImpl } from "../action/action-handler";
import { actionMessages, MiniMapData, parseResponseString, triggers } from "../action/actions/action-resources";
import { ToggleConnectionAction } from "../action/dmactions/toggleRoomConnection-action";
import { AmqpAdapter } from "../amqp/amqp-adapter";

const DUNGEONMASTER = 'dungeonmaster';

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
                this.login(data.user, data.character);
                break;
            case 'logout':
                this.logout(data.user, data.character);
                break;
            case 'message':
                this.actionHandler.processAction(data.character, data.data.message);
                break;
            case 'dmmessage':
                this.actionHandler.processDmAction(data.data.message);
                break;
            case 'connection.toggle':
                let toggleConnectionAction: ToggleConnectionAction = this.actionHandler.dmActions[triggers.toggleConnection] as ToggleConnectionAction
                toggleConnectionAction.modifyConnection(data.data.roomId, data.data.direction, data.data.status)
        }
    }

    private async login(user: string, characterName: string) {
        console.log(`login ${characterName}`);

        let character = await this.getCharacter(characterName);
        this.dungeon.characters[characterName] = character;
        await this.amqpAdapter.initClient(characterName);
        if (characterName !== 'dungeonmaster') {
            await this.amqpAdapter.bindClientQueue(characterName, `room.${character.getPosition()}`);
        }
        this.amqpAdapter.broadcastAction('message', { message: `${characterName} ist dem Dungeon beigetreten!` });
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
    }

    private async logout(user: string, characterName: string) {
        console.log(`logout ${characterName}`);
        delete this.verifyTokens[characterName];
        if (characterName !== DUNGEONMASTER) {
            await this.persistCharacterData(this.dungeon.getCharacter(characterName))
            delete this.dungeon.characters[characterName];
            this.sendPlayerListToDM();
            sendToHost('dungeonState', { currentPlayers: this.dungeon.getCurrentPlayers() });
        } else {
            delete this.dungeon.characters[characterName];
            sendToHost('dungeonState', { currentPlayers: this.dungeon.getCurrentPlayers() });
            this.kickAllPlayers('Der Dungeon wurde beendet'); // TODO: Recource
            this.stopDungeon();
        }
    }

    public async kickPlayer(character: string, message: any) {
        await this.amqpAdapter.sendActionToClient(character, 'kick', { message: message });
    }

    private async kickAllPlayers(message: any) {
        await this.amqpAdapter.broadcastAction('kick', { message: message });
    }

    sendPlayerListToDM() {
        this.amqpAdapter.sendActionToClient(DUNGEONMASTER, 'updateOnlinePlayers', Object.keys(this.dungeon.characters));
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
        this.databaseAdapter?.updateRooms(rooms, this.dungeonID)
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
        characters.filter(char => char.name !== 'dungeonmaster').forEach(async char => {
            await this.persistCharacterData(char);
        });
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

    private async getCharacter(name: string): Promise<Character> {
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
                return new CharacterImpl(char.userId, char.name, char.characterClass, char.characterSpecies, char.characterGender, new CharacterStatsImpl(maxStats.hp, maxStats.dmg, maxStats.mana), 
                    new CharacterStatsImpl(curStats.hp, curStats.dmg, curStats.mana), char.position, exploredRooms, char.inventory);
            }
        }
        return this.createCharacter(name);
    }

    private createCharacter(name: string): Character {
        let newCharacter: Character = new CharacterImpl(
            name,
            name,
            '',
            '',
            '',
            new CharacterStatsImpl(1, 1, 1),
            new CharacterStatsImpl(1, 1, 1),
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
        const isDm: boolean = DUNGEONMASTER === character; // TODO: Find it in another way
        const exploredRooms = this.dungeon.getCharacter(character).exploredRooms;
        for (let room in this.dungeon.rooms) {
            rooms[room] = {
                xCoordinate: this.dungeon.rooms[room].xCoordinate,
                yCoordinate: this.dungeon.rooms[room].yCoordinate,
                connections: this.dungeon.rooms[room].connections,
                explored: exploredRooms[room] || false, // TODO: Find a way to check if the room is explored
                name: isDm ? this.dungeon.rooms[room].name : undefined
            }
        }
        console.log(this.getDungeon().getCharacter(character).getPosition());
        await this.amqpAdapter.sendActionToClient(character, 'minimap.init', {
                rooms: rooms,
                startRoom:  this.getDungeon().getCharacter(character).getPosition() //TODO: Actually get the room the character is in at the start
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
}
