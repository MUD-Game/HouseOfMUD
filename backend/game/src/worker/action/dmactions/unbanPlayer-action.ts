import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, parseResponseString, actionMessages, helpMessagesForDM, errorMessages, dmActionDescriptions } from "../actions/action-resources";

export class UnbanPlayer implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.unbanPlayer;
        this.dungeonController = dungeonController
    }
    async performAction(user: string, args: string[]) {
        const dungeon: Dungeon = this.dungeonController.getDungeon()
        const characterToUnban: string = args[0]
        const amqpAdapter = this.dungeonController.getAmqpAdapter();
        this.dungeonController.gerUserIdFromCharacter(characterToUnban)?.then(userId => {
            if(userId){
                if(dungeon.getBlacklist().includes(userId)){
                this.dungeonController.getDungeon().blacklist.splice(this.dungeonController.getDungeon().blacklist.indexOf(userId), 1);
                this.dungeonController.persistBlacklist();
                amqpAdapter.broadcastAction('message', {message: parseResponseString(actionMessages.playerUnbanned, characterToUnban)});
                }else{
                    amqpAdapter.sendActionToClient(user, 'message', {message: errorMessages.playerNotBanned});
                }
            }else{
                amqpAdapter.sendActionToClient(user, "message", {message: parseResponseString(helpMessagesForDM.characterDoesNotExist, characterToUnban) + dmActionDescriptions.unbanPlayer})
            }
        })



    }
}