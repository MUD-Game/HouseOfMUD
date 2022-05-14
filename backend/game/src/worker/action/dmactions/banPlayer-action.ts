import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, parseResponseString, actionMessages, helpMessagesForDM, errorMessages, dmActionDescriptions } from "../actions/action-resources";

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
            let idOfUserToBan: string = character.getUserId()
            let dungeonCreatorId: string = dungeon.getCreatorId()
            let dungeonMasterId: string = dungeon.getMasterId()
            if (idOfUserToBan === dungeonCreatorId) {
                this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: errorMessages.cannotBanDungeonCreator})
            } else if (idOfUserToBan === dungeonMasterId) {
                this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: errorMessages.cannotBanOwnCharacter})
            } else {
                // save banned user
                dungeon.getBlacklist().push(idOfUserToBan)
                let dungeonCharacters: Character[] = Object.values(dungeon.characters)
                dungeonCharacters.forEach(async character => {
                    if (character.getUserId() === idOfUserToBan) {
                        await this.dungeonController.kickPlayer(character.getName(), {type: kickType, kickMessage: message})
                    } else {
                        return;
                    }
                })
                amqpAdapter.broadcastAction('message', {message: parseResponseString(actionMessages.playerBanned, recipientCharacterName)})
                this.dungeonController.persistBlacklist()
            }

        } catch (e) {
            //console.log(e)
            this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(helpMessagesForDM.characterDoesNotExist, recipientCharacterName) + dmActionDescriptions.banPlayer})
        }
    }
}