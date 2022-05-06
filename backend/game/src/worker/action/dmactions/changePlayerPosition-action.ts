import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, errorMessages, dungeonMasterSendMessages, parseResponseString, extras } from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";


export class ChangeRoom implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.changeRoom;
        this.dungeonController = dungeonController
    }
    async performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let recipientCharacterName: string = args[0]
        args.shift()
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let roomstring: string = ''
        try {
            let recipientCharacter: Character = dungeon.getCharacter(recipientCharacterName)


            let actualroom: string = recipientCharacter.getPosition()
        
            try {
                let newRoom: string = args[0]
         
                if (actualroom == newRoom) {

                    roomstring = parseResponseString(dungeonMasterSendMessages.alreadyRoom)
                    this.dungeonController.getAmqpAdapter().sendToClient(user, { action: "message", data: { message: roomstring } })

                } else if (actualroom !== newRoom) {
   
                    recipientCharacter.modifyPosition(newRoom)

                    roomstring = parseResponseString(dungeonMasterSendMessages.dmRoomMove, recipientCharacterName ,args.join(' '))
                    this.dungeonController.getAmqpAdapter().sendToClient(user, { action: "message", data: { message: roomstring } })

                    roomstring = parseResponseString(dungeonMasterSendMessages.roomMove, args.join(' '))
                    this.dungeonController.getAmqpAdapter().sendToClient(recipientCharacter.name, { action: "message", data: { message: roomstring } })
                }
                await this.dungeonController.sendStatsData(recipientCharacter.position)

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
