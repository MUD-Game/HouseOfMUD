import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, errorMessages, dungeonMasterSendMessages, parseResponseString, extras } from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";


export class RemoveDamage implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.removeDamage;
        this.dungeonController = dungeonController
    }
    async performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let recipientCharacterName: string = args[0]
        args.shift()
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let damagestring: string = ''
        try {
            let recipientCharacter: Character = dungeon.getCharacter(recipientCharacterName)
            let actualDmg: number = recipientCharacter.getCharakterStats().getDmg()
            let maxDmg: number = recipientCharacter.getMaxStats().getDmg()
            try {
                let dmgCount: number = +args[0]
                if (actualDmg - dmgCount <= 0) {
                    damagestring = parseResponseString(dungeonMasterSendMessages.removeDmg, (actualDmg).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: damagestring })

                    damagestring = parseResponseString(dungeonMasterSendMessages.dmgRemoved, recipientCharacter.name , (actualDmg).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: damagestring } )
                    recipientCharacter.getCharakterStats().setDmg(0)

                } else if (actualDmg - dmgCount > 0) {
                    actualDmg = actualDmg - dmgCount 
                    recipientCharacter.getCharakterStats().setDmg(actualDmg)
                    
                    damagestring = parseResponseString(dungeonMasterSendMessages.removeDmg, args.join(' '))
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: damagestring } )

                    damagestring = parseResponseString(dungeonMasterSendMessages.dmgRemoved, recipientCharacter.name , args.join(' '))
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: damagestring } )
                }

            } catch (e) {
                //console.log(e)
                amqpAdapter.sendActionToClient(user, "message", { message: parseResponseString(errorMessages.actionDoesNotExist, recipientCharacterName) })
            }
            await this.dungeonController.sendStatsData(recipientCharacter.name)


        } catch (e) {
            //console.log(e)
            amqpAdapter.sendActionToClient(user, "message", { message: parseResponseString(errorMessages.characterDoesNotExist, recipientCharacterName) })
        }
    }
}
