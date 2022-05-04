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
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let recipientCharacterName: string = args[0]
        args.shift()
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let lifestring: string = ''
        try {
            let recipientCharacter: Character = dungeon.getCharacter(recipientCharacterName)


            let actualDmg: number = recipientCharacter.getCharakterStats().getDmg()
            let maxDmg: number = recipientCharacter.getMaxStats().getDmg()
            try {
                let dmgCount: number = +args[0]
         
                if (actualDmg - dmgCount <= 0) {
                    recipientCharacter.getCharakterStats().setDmg(0)
                    //sterbefunktion ? 
                    lifestring = parseResponseString(dungeonMasterSendMessages.removeDmg, (actualDmg).toString())
                 
                    this.dungeonController.getAmqpAdapter().sendToClient(user, { action: "message", data: { message: lifestring } })

                } else if (actualDmg - dmgCount > 0) {
                    actualDmg = actualDmg - dmgCount 
                    recipientCharacter.getCharakterStats().setDmg(actualDmg)
                    lifestring = parseResponseString(dungeonMasterSendMessages.removeDmg, args.join(' '))
                    this.dungeonController.getAmqpAdapter().sendToClient(user, { action: "message", data: { message: lifestring } })
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
