import { AmqpAdapter } from "../amqp/amqp-adapter";
import { Character, CharacterGenderImpl, CharacterImpl, CharacterSpeciesImpl, CharacterStatsImpl, Dungeon } from "../../dungeon/dungeon"
import { ConsumeMessage } from "amqplib";
import { ActionHandlerImpl, ActionHandler } from "../action/action-handler";


export class DungeonController {

    private dungeonID: string;
    private amqpAdapter: AmqpAdapter;
    private actionHandler: ActionHandler;
    private dungeon: Dungeon;

    constructor(dungeonID: string, amqpAdapter: AmqpAdapter, dungeon: Dungeon) {
        this.dungeonID = dungeonID;
        this.amqpAdapter = amqpAdapter;
        this.dungeon = dungeon;

        this.actionHandler = new ActionHandlerImpl(this);
    }

    init() {
        this.amqpAdapter.consume((consumeMessage: ConsumeMessage) => {
            let data = JSON.parse(consumeMessage.content.toString());
            console.log(data);
            switch (data.action) {
                case 'login':
                    let character = this.createCharacter(data.character);
                    this.amqpAdapter.initClient(data.character);
                    this.amqpAdapter.bindClientQueue(data.character, `room.${character.getPosition()}`);
                    setTimeout(() => {
                        this.amqpAdapter.broadcast({
                            action: 'message',
                            data: { message: `${data.character} ist dem Dungeon beigetreten!` },
                        });
                    }, 200);
                    break;
                case 'message':
                    this.actionHandler.processAction(data.character, data.data.message);
                    break;
            }
            // TODO: check verifyToken
            // this.actionHandler.processAction(data.character, data.data.message);
        });
    }

    createCharacter(name: string): Character {
        let newCharacter: Character = new CharacterImpl(
            name,
            name,
            '1',
            name,
            'Magier',
            new CharacterSpeciesImpl(
                '1',
                'Hexer',
                'Hexiger Hexer'
            ),
            new CharacterGenderImpl(
                '1',
                'Mann',
                'Maennlicher Mann'
            ),
            new CharacterStatsImpl(100, 20, 100),
            new CharacterStatsImpl(100, 20, 100),
            "1",
            ["1"]
        );
        this.dungeon.characters.push(newCharacter);
        return newCharacter;
    }

    getDungeon(): Dungeon {
        return this.dungeon
    }

    getAmqpAdapter(): AmqpAdapter {
        return this.amqpAdapter
    }

    
}
