import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, errorMessages, dungeonMasterSendMessages, parseResponseString, helpMessagesForDM} from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { Room } from "../../../data/interfaces/room";


export class AddHp implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.addHp;
        this.dungeonController = dungeonController
    }
    async performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let recipientCharacterName: string = args[0]
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let hpstring: string = ''
        try {
            let recipientCharacter: Character = dungeon.getCharacter(recipientCharacterName)
            let roomId: string = recipientCharacter.getPosition()
            let room: Room = dungeon.getRoom(roomId)
            let roomName: string = room.getName()
            let actualHp: number = recipientCharacter.getCharakterStats().getHp()
            let maxHp: number = recipientCharacter.getMaxStats().getHp()
            let hpCount: number = +args[1]
            if (isNaN(hpCount)) {
                amqpAdapter.sendActionToClient(user, "message", { message: helpMessagesForDM.valueNotANumber, room: roomName})
            } else {
                if (maxHp - actualHp >= hpCount) {
                    actualHp = actualHp + hpCount
                    console.log(actualHp) 
                    recipientCharacter.getCharakterStats().setHp(actualHp)
                    
                    hpstring = parseResponseString(dungeonMasterSendMessages.addHp, args[1])
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: hpstring } )

                    hpstring = parseResponseString(dungeonMasterSendMessages.hpRecieved, recipientCharacter.name , args[1])
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: hpstring, room: roomName } )

                } else if (maxHp - actualHp < hpCount) {
                    hpstring = parseResponseString(dungeonMasterSendMessages.addHp, (maxHp-actualHp).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: hpstring } )

                    hpstring = parseResponseString(dungeonMasterSendMessages.hpRecieved, recipientCharacter.name , (maxHp-actualHp).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: hpstring, room: roomName } )
                    
                    recipientCharacter.getCharakterStats().setHp(maxHp)
                }
                await this.dungeonController.sendStatsData(recipientCharacter.name)
            }

        } catch (e) {
            //console.log(e)
            amqpAdapter.sendActionToClient(user, "message", { message: parseResponseString(helpMessagesForDM.characterDoesNotExist, recipientCharacterName) })
        }
    }
}
