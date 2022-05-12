import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, parseResponseString, actionMessages, helpMessagesForDM } from "../actions/action-resources";

export class BanPlayer implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.banPlayer;
        this.dungeonController = dungeonController
    }
    async performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let recipientCharacterName: string = args[0]
        args.shift()
        let kickType: string = this.trigger
        let message: string = args.join(' ')
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        try {
            let character: Character = dungeon.getCharacter(recipientCharacterName)
            let userId: string = character.getUserId()
            // save banned user
            dungeon.getBlacklist().push(userId)
            await this.dungeonController.kickPlayer(recipientCharacterName, {type: kickType, kickMessage: message})
            amqpAdapter.broadcastAction('message', {message: parseResponseString(actionMessages.playerBanned, recipientCharacterName)})
            this.dungeonController.persistBlacklist()
        } catch (e) {
            //console.log(e)
            this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(helpMessagesForDM.characterDoesNotExist, recipientCharacterName)})
        }
    }
}