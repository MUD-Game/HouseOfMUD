import { AmqpAdapter } from "./amqp-adapter";
import { Dungeon } from "../dungeon/dungeon"
import { ConsumeMessage } from "amqplib";
import { ActionHandlerImpl, ActionHandler } from "./action/action-handler";


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
                    this.amqpAdapter.initClient(data.character);
                    break;
                case 'message':
                    this.actionHandler.processAction(data.character, data.data.message);
                    break;
            }
            // TODO: check verifyToken
            // this.actionHandler.processAction(data.character, data.data.message);
        });
    }

    getDungeon(): Dungeon {
        return this.dungeon
    }

    getAmqpAdapter(): AmqpAdapter {
        return this.amqpAdapter
    }

    
}
