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

function sendToHost(hostAction: string, data: any): void {
    if (process.send) {
        process.send({
            host_action: hostAction,
            data: data
        });
    }
}

export class DungeonController {

    private dungeonID: string;
    private amqpAdapter: AmqpAdapter;
    private databaseAdapter: DatabaseAdapter | null;
    private actionHandler: ActionHandler;
    private dungeon: Dungeon;

    constructor(dungeonID: string, amqpAdapter: AmqpAdapter, databaseAdapter: DatabaseAdapter | null, dungeon: Dungeon) {
        this.dungeonID = dungeonID;
        this.amqpAdapter = amqpAdapter;
        this.databaseAdapter = databaseAdapter;
        this.dungeon = dungeon;

        this.actionHandler = new ActionHandlerImpl(this);
    }

    init() {
        // comsume messages from clients
        this.amqpAdapter.consume(async (consumeMessage: ConsumeMessage) => {
            try {
                let data = JSON.parse(consumeMessage.content.toString());
                console.log(data);
                if (data.action !== undefined && data.character !== undefined && data.data !== undefined) {
                    switch (data.action) {
                        case 'login':
                            // TODO: Refactor
                            /* temporary */
                            // let character = this.createCharacter(data.character);
                            let character = await this.getCharacter(data.character);
                            this.dungeon.characters[data.character] = character;
                            /* temporary */
                            await this.amqpAdapter.initClient(data.character);
                            await this.amqpAdapter.bindClientQueue(data.character, `room.${character.getPosition()}`);
                            this.amqpAdapter.broadcastAction('message', { message: `${data.character} ist dem Dungeon beigetreten!` });
                            sendToHost('dungeonState', { currentPlayers: Object.keys(this.dungeon.characters).length });
                            if (data.character !== 'dungeonmaster') {
                                await this.amqpAdapter.sendActionToClient(data.character, "message", {message: parseResponseString(actionMessages.helpMessage, this.dungeon.name, triggers.showActions, triggers.look, triggers.help)})
                            }
                            await this.sendStatsData(data.character)
                            await this.sendMiniMapData(data.character);
                            await this.sendInventoryData(data.character);
                            break;
                        case 'logout':
                            // TODO: Refactor
                            //! Hier müssen die CharacterDaten gespeichert werden.
                            await this.persistCharacterData(this.dungeon.getCharacter(data.character))
                            delete this.dungeon.characters[data.character];
                            sendToHost('dungeonState', { currentPlayers: Object.keys(this.dungeon.characters).length });
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
            } catch (err) {
                console.log(err);
            }
        });
    }

    async persistAllRooms(){
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

    async persistCharacterData(character: Character){
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

    async getCharacter(name: string): Promise<Character> {
        if (this.databaseAdapter) {
            let char = await this.databaseAdapter.getCharacterFromDungeon(name, this.dungeonID);
            console.log(char);
            if (char) {
                let maxStats = char.maxStats;
                let curStats = char.currentStats;
                let exploredRooms:Character['exploredRooms'] = {};
                char.exploredRooms.forEach((room:string) => {
                    exploredRooms[room] = true;
                });
                return new CharacterImpl(char.userId, char.name, char.characterClass, char.characterSpecies, char.characterGender, new CharacterStatsImpl(maxStats.hp, maxStats.dmg, maxStats.mana), 
                    new CharacterStatsImpl(curStats.hp, curStats.dmg, curStats.mana), char.position, exploredRooms, char.inventory);
            }
        }
        return this.createCharacter(name);
    }

    createCharacter(name: string): Character {
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
        const isDm: boolean = 'dungeonmaster' === character; // TODO: Find it in another way
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
