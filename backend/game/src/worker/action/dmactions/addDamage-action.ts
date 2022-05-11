import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, errorMessages, dungeonMasterSendMessages, parseResponseString, extras } from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";


export class AddDamage implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.addDamage;
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
                if (maxDmg - actualDmg >= dmgCount) {
                    actualDmg = actualDmg + dmgCount 
                    recipientCharacter.getCharakterStats().setDmg(actualDmg)
                    damagestring = parseResponseString(dungeonMasterSendMessages.addDmg, args.join(' '))
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: damagestring } )

                    damagestring = parseResponseString(dungeonMasterSendMessages.damageRecieved, recipientCharacter.name , args.join(' '))
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: damagestring } )
                } else if (maxDmg - actualDmg < dmgCount) {
                
                    damagestring = parseResponseString(dungeonMasterSendMessages.addDmg, (maxDmg-actualDmg).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: damagestring } )

                    damagestring = parseResponseString(dungeonMasterSendMessages.damageRecieved, recipientCharacter.name , (maxDmg-actualDmg).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: damagestring } )
                    recipientCharacter.getCharakterStats().setDmg(maxDmg)

                }
                await this.dungeonController.sendStatsData(recipientCharacter.name)

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
