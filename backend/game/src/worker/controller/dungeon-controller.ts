import { ConsumeMessage } from "amqplib";
import { DatabaseAdapter } from "../../data/databaseAdapter";
import { Character, CharacterImpl } from "../../data/interfaces/character";
import { CharacterStats, CharacterStatsImpl } from "../../data/interfaces/characterStats";
import { Dungeon } from "../../data/interfaces/dungeon";
import { ActionHandler, ActionHandlerImpl } from "../action/action-handler";
import { MiniMapData } from "../action/actions/action-resources";
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

                            await this.sendStatsData(data.character)
                            await this.sendMiniMapData(data.character);
                            await this.sendInventoryData(data.character);
                            break;
                        case 'logout':
                            // TODO: Refactor
                            delete this.dungeon.characters[data.character];
                            sendToHost('dungeonState', { currentPlayers: Object.keys(this.dungeon.characters).length });
                            break;
                        case 'message':
                            this.actionHandler.processAction(data.character, data.data.message);
                            break;
                        case 'dmMessage':
                            //dmaction
                            break;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        });
    }

    async getCharacter(name: string): Promise<Character> {
        if (this.databaseAdapter) {
            let char = await this.databaseAdapter.getCharacterFromDungeon(name, this.dungeonID);
            console.log(char);
            if (char) {
                let maxStats = char.maxStats;
                let curStats = char.currentStats;
                return new CharacterImpl(char.userId, char.name, char.characterClass, char.characterSpecies, char.characterGender, new CharacterStatsImpl(maxStats.hp, maxStats.dmg, maxStats.mana), 
                    new CharacterStatsImpl(curStats.hp, curStats.dmg, curStats.mana), char.position, char.inventory);
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

    async sendMiniMapData(character: string) {
        let rooms:MiniMapData["rooms"] = {};
        for (let room in this.dungeon.rooms) {
            rooms[room] = {
                xCoordinate: this.dungeon.rooms[room].xCoordinate,
                yCoordinate: this.dungeon.rooms[room].yCoordinate,
                connections: this.dungeon.rooms[room].connections,
                explored: false // TODO: Find a way to check if the room is explored
            }
        }
        rooms["0,0"].explored = true;
        await this.amqpAdapter.sendActionToClient(character, 'minimap.init', {
                rooms: rooms,
                startRoom: "0,0" //TODO: Actually get the room the character is in at the start
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
