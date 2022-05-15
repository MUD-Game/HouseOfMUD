import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, errorMessages, dungeonMasterSendMessages, parseResponseString, actionMessages, helpMessagesForDM, dmActionDescriptions} from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";


export class KickPlayer implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.kickPlayer;
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
            await this.dungeonController.kickPlayer(recipientCharacterName, {type: kickType, kickMessage: message})
            amqpAdapter.broadcastAction('message', {message: parseResponseString(actionMessages.playerKicked, recipientCharacterName)})
        } catch (e) {
            //console.log(e)
            this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(helpMessagesForDM.characterDoesNotExist, recipientCharacterName) + dmActionDescriptions.kickPlayer})
        }
    }
}
