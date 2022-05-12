import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, errorMessages, dungeonMasterSendMessages, parseResponseString, extras, helpMessagesForDM } from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { Room } from "../../../data/interfaces/room";


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
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let damagestring: string = ''
        try {
            let recipientCharacter: Character = dungeon.getCharacter(recipientCharacterName)
            let roomId: string = recipientCharacter.getPosition()
            let room: Room = dungeon.getRoom(roomId)
            let roomName: string = room.getName()
            let actualDmg: number = recipientCharacter.getCharakterStats().getDmg()
            let maxDmg: number = recipientCharacter.getMaxStats().getDmg()
            let dmgCount: number = +args[1]
            if (isNaN(dmgCount)) {
                amqpAdapter.sendActionToClient(user, "message", { message: helpMessagesForDM.valueNotANumber, room: roomName})
            } else {
                if (maxDmg - actualDmg >= dmgCount) {
                    actualDmg = actualDmg + dmgCount 
                    recipientCharacter.getCharakterStats().setDmg(actualDmg)
                    damagestring = parseResponseString(dungeonMasterSendMessages.addDmg, args[1])
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: damagestring } )
    
                    damagestring = parseResponseString(dungeonMasterSendMessages.damageRecieved, recipientCharacter.name , args[1])
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: damagestring, room: roomName } )
                } else if (maxDmg - actualDmg < dmgCount) {
                
                    damagestring = parseResponseString(dungeonMasterSendMessages.addDmg, (maxDmg-actualDmg).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: damagestring } )
    
                    damagestring = parseResponseString(dungeonMasterSendMessages.damageRecieved, recipientCharacter.name , (maxDmg-actualDmg).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: damagestring, room: roomName } )
                    recipientCharacter.getCharakterStats().setDmg(maxDmg)
    
                }
                await this.dungeonController.sendStatsData(recipientCharacter.name)
            }

        } catch (e) {
            //console.log(e)
            amqpAdapter.sendActionToClient(user, "message", { message: parseResponseString(helpMessagesForDM.characterDoesNotExist, recipientCharacterName)})
        }
    }
}
