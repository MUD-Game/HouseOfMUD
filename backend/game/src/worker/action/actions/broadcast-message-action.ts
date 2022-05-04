import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers } from "./action-resources";

export class BroadcastMessageAction extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.broadcast, dungeonController);
    }
    
    performAction(user: string, args: string[]) {
        let messageBody: string = args.join(' ')
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        amqpAdapter.broadcast({action: "message", data: {message: messageBody}})
        newf()
    }

    
}

function newf() {}