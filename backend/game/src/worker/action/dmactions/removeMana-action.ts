import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, errorMessages, dungeonMasterSendMessages, parseResponseString, extras } from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";


export class RemoveMana implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.removeMana;
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


            let actualMana: number = recipientCharacter.getCharakterStats().getMana()
            let maxMana: number = recipientCharacter.getMaxStats().getMana()
            try {
                let manaCount: number = +args[0]
         
                if (actualMana - manaCount <= 0) {
                    recipientCharacter.getCharakterStats().setMana(0)
                    //sterbefunktion ? 
                    lifestring = parseResponseString(dungeonMasterSendMessages.removeMana, (actualMana).toString())
                    
                    this.dungeonController.getAmqpAdapter().sendToClient(user, { action: "message", data: { message: lifestring } })

                } else if (actualMana - manaCount > 0) {
                    actualMana = actualMana - manaCount 
                    recipientCharacter.getCharakterStats().setMana(actualMana)
                    lifestring = parseResponseString(dungeonMasterSendMessages.removeMana, args.join(' '))
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
