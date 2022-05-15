import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, parseResponseString, triggers } from "../actions/action-resources";

export class BroadcastMessageAction extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.broadcast, dungeonController);
    }
    
    performAction(user: string, args: string[]) {
        let messageBody: string = args.join(' ')
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        amqpAdapter.broadcastAction("message", {message: parseResponseString(actionMessages.broadcast, messageBody)})
    }

    
}