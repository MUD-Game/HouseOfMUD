import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, errorMessages, dungeonMasterSendMessages, parseResponseString, extras, helpMessagesForDM } from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { Room } from "../../../data/interfaces/room";


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
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let damagestring: string = ''
        try {
            let recipientCharacter: Character = dungeon.getCharacter(recipientCharacterName)
            let roomId: string = recipientCharacter.getPosition()
            let room: Room = dungeon.getRoom(roomId)
            let roomName: string = room.getName()
            let actualDmg: number = recipientCharacter.getCharakterStats().getDmg()
            let dmgCount: number = +args[1]
            if (isNaN(dmgCount)) {
                amqpAdapter.sendActionToClient(user, "message", { message: helpMessagesForDM.valueNotANumber})
            } else {
                if (actualDmg - dmgCount <= 0) {
                    damagestring = parseResponseString(dungeonMasterSendMessages.removeDmg, (actualDmg).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: damagestring })

                    damagestring = parseResponseString(dungeonMasterSendMessages.dmgRemoved, recipientCharacter.name , (actualDmg).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: damagestring, room: roomName } )
                    recipientCharacter.getCharakterStats().setDmg(0)

                } else if (actualDmg - dmgCount > 0) {
                    actualDmg = actualDmg - dmgCount 
                    recipientCharacter.getCharakterStats().setDmg(actualDmg)
                    
                    damagestring = parseResponseString(dungeonMasterSendMessages.removeDmg, args[1])
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: damagestring } )

                    damagestring = parseResponseString(dungeonMasterSendMessages.dmgRemoved, recipientCharacter.name , args[1])
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: damagestring, room: roomName } )
                }
                await this.dungeonController.sendStatsData(recipientCharacter.name)
            }
                

        } catch (e) {
            //console.log(e)
            amqpAdapter.sendActionToClient(user, "message", { message: parseResponseString(helpMessagesForDM.characterDoesNotExist, recipientCharacterName) })
        }
    }
}
