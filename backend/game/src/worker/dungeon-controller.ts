import { AmqpAdapter } from "./amqp-adapter";
import { Dungeon } from "../dungeon/dungeon"


export class DungeonController {
    private amqpAdapter: AmqpAdapter;

    private dungeon: Dungeon;

    constructor(amqpAdapter: AmqpAdapter, dungeon: Dungeon) {
        this.amqpAdapter = amqpAdapter;
        this.dungeon = dungeon;
    }

    getDungeon(): Dungeon {
        return this.dungeon
    }

    getAmqpAdapter(): AmqpAdapter {
        return this.amqpAdapter
    }

    
}
