import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, errorMessages, dungeonMasterSendMessages, parseResponseString} from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";


export class AddHp implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.addHp;
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let recipientCharacterName: string = args[0]
        args.shift()
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let hpstring: string = ''
        try {
            let recipientCharacter: Character = dungeon.getCharacter(recipientCharacterName)
            let actualHp: number = recipientCharacter.getCharakterStats().getHp()
            let maxHp: number = recipientCharacter.getMaxStats().getHp()
            try {
                let hpCount: number = +args[0]
                if (maxHp - actualHp >= hpCount) {
                    actualHp = actualHp + hpCount
                    console.log(actualHp) 
                    recipientCharacter.getCharakterStats().setHp(actualHp)
                   
                    hpstring = parseResponseString(dungeonMasterSendMessages.addHp, args.join(' '))
                    this.dungeonController.getAmqpAdapter().sendToClient(recipientCharacter.name, { action: "message", data: { message: hpstring } })

                    hpstring = parseResponseString(dungeonMasterSendMessages.hpRecieved, recipientCharacter.name , args.join(' '))
                    this.dungeonController.getAmqpAdapter().sendToClient(user, { action: "message", data: { message: hpstring } })

                } else if (maxHp - actualHp < hpCount) {


                    hpstring = parseResponseString(dungeonMasterSendMessages.addHp, (maxHp-actualHp).toString())
                    this.dungeonController.getAmqpAdapter().sendToClient(recipientCharacter.name, { action: "message", data: { message: hpstring } })

                    hpstring = parseResponseString(dungeonMasterSendMessages.hpRecieved, recipientCharacter.name , (maxHp-actualHp).toString())
                    this.dungeonController.getAmqpAdapter().sendToClient(user, { action: "message", data: { message: hpstring } })
                  

                    recipientCharacter.getCharakterStats().setHp(maxHp)
                  

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
