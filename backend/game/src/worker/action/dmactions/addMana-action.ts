import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, errorMessages, dungeonMasterSendMessages, parseResponseString} from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";


export class AddMana implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.addMana;
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let recipientCharacterName: string = args[0]
        args.shift()
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let manastring: string = ''
        try {
            let recipientCharacter: Character = dungeon.getCharacter(recipientCharacterName)

            let actualMana: number = recipientCharacter.getCharakterStats().getMana()
            let maxMana: number = recipientCharacter.getMaxStats().getMana()
            try {
                let manaCount: number = +args[0]
         
                if (maxMana - actualMana >= manaCount) {
                    actualMana = actualMana + manaCount 
                    recipientCharacter.getCharakterStats().setMana(actualMana)
                   
                    manastring = parseResponseString(dungeonMasterSendMessages.addMana, args.join(' '))
                    this.dungeonController.getAmqpAdapter().sendToClient(recipientCharacter.name, { action: "message", data: { message: manastring } })

                    manastring = parseResponseString(dungeonMasterSendMessages.manaRecieved, recipientCharacter.name , args.join(' '))
                    this.dungeonController.getAmqpAdapter().sendToClient(user, { action: "message", data: { message: manastring } })

                } else if (maxMana - actualMana < manaCount) {


                    manastring = parseResponseString(dungeonMasterSendMessages.addMana, (maxMana-actualMana).toString())
                    this.dungeonController.getAmqpAdapter().sendToClient(recipientCharacter.name, { action: "message", data: { message: manastring } })

                    manastring = parseResponseString(dungeonMasterSendMessages.manaRecieved, recipientCharacter.name , (maxMana-actualMana).toString())
                    this.dungeonController.getAmqpAdapter().sendToClient(user, { action: "message", data: { message: manastring } })
                  

                    recipientCharacter.getCharakterStats().setMana(maxMana)
                  

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
