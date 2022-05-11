import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, errorMessages, dungeonMasterSendMessages, parseResponseString, extras } from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DieAction } from "../actions/die-action";


export class RemoveHp implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.removeHp;
        this.dungeonController = dungeonController
    }
    async performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let recipientCharacterName: string = args[0]
        args.shift()
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let lifestring: string = ''
        try {
            let recipientCharacter: Character = dungeon.getCharacter(recipientCharacterName)
            let actualHp: number = recipientCharacter.getCharakterStats().getHp()
            let maxHp: number = recipientCharacter.getMaxStats().getHp()
            try {
                let hpCount: number = +args[0]
                if (actualHp - hpCount <= 0) {
                    recipientCharacter.getCharakterStats().setHp(0)
                    lifestring = parseResponseString(dungeonMasterSendMessages.removeHp, (actualHp).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: lifestring })

                    lifestring = parseResponseString(dungeonMasterSendMessages.hpRemoved, recipientCharacter.name , (actualHp).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: lifestring })

                } else if (actualHp - hpCount > 0) {
                    actualHp = actualHp - hpCount 
                    recipientCharacter.getCharakterStats().setHp(actualHp)

                    lifestring = parseResponseString(dungeonMasterSendMessages.removeHp, args.join(' '))
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: lifestring })

                    lifestring = parseResponseString(dungeonMasterSendMessages.hpRemoved, recipientCharacter.name , args.join(' '))
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: lifestring } )

                }
                await this.dungeonController.sendStatsData(recipientCharacter.name)
                await this.dungeonController.getActionHandler().dieAction.performAction(recipientCharacter.name, [])

            } catch (e) {
                //console.log(e)
                amqpAdapter.sendActionToClient(user, "message", { message: parseResponseString(errorMessages.actionDoesNotExist, recipientCharacterName) })
            }


        } catch (e) {
            //console.log(e)
            amqpAdapter.sendActionToClient(user, "message", { message: parseResponseString(errorMessages.characterDoesNotExist, recipientCharacterName) })
        }
    }
}
