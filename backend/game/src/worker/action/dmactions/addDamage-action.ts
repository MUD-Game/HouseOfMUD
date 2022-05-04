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
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        //let senderCharacter: Character = dungeon.getCharacter(user)
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
                    this.dungeonController.getAmqpAdapter().sendToClient(user, { action: "message", data: { message: damagestring } })

                } else if (maxDmg - actualDmg < dmgCount) {
                
                    recipientCharacter.getCharakterStats().setDmg(maxDmg)
                    damagestring = parseResponseString(dungeonMasterSendMessages.addDmg, (maxDmg - actualDmg).toString())
                    this.dungeonController.getAmqpAdapter().sendToClient(user, { action: "message", data: { message: damagestring } })
                }

            } catch (e) {
                console.log(e)
                amqpAdapter.sendToClient(user, { action: "message", data: { message: parseResponseString(errorMessages.actionDoesNotExist, recipientCharacterName) } })
            }


        } catch (e) {
            console.log(e)
            amqpAdapter.sendToClient(user, { action: "message", data: { message: parseResponseString(errorMessages.characterDoesNotExist, recipientCharacterName) } })
        }
    }
}
