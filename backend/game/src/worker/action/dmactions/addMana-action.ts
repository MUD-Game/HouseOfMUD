import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, errorMessages, dungeonMasterSendMessages, parseResponseString, helpMessagesForDM} from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { Room } from "../../../data/interfaces/room";


export class AddMana implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.addMana;
        this.dungeonController = dungeonController
    }
    async performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let recipientCharacterName: string = args[0]
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let manastring: string = ''
        try {
            let recipientCharacter: Character = dungeon.getCharacter(recipientCharacterName)
            let roomId: string = recipientCharacter.getPosition()
            let room: Room = dungeon.getRoom(roomId)
            let roomName: string = room.getName()
            let actualMana: number = recipientCharacter.getCharakterStats().getMana()
            let maxMana: number = recipientCharacter.getMaxStats().getMana()
            let manaCount: number = +args[1]
            if (isNaN(manaCount)) {
                amqpAdapter.sendActionToClient(user, "message", { message: helpMessagesForDM.valueNotANumber})
            } else {
                if (maxMana - actualMana >= manaCount) {
                    actualMana = actualMana + manaCount 
                    recipientCharacter.getCharakterStats().setMana(actualMana)
                    
                    manastring = parseResponseString(dungeonMasterSendMessages.addMana, args[1])
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: manastring } )

                    manastring = parseResponseString(dungeonMasterSendMessages.manaRecieved, recipientCharacter.name , args[1])
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: manastring, room: roomName } )

                } else if (maxMana - actualMana < manaCount) {
                    manastring = parseResponseString(dungeonMasterSendMessages.addMana, (maxMana-actualMana).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: manastring } )

                    manastring = parseResponseString(dungeonMasterSendMessages.manaRecieved, recipientCharacter.name , (maxMana-actualMana).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: manastring, room: roomName } )
                    
                    recipientCharacter.getCharakterStats().setMana(maxMana)
                }
                await this.dungeonController.sendStatsData(recipientCharacter.name)
            }

        } catch (e) {
            //console.log(e)
            amqpAdapter.sendActionToClient(user, "message", { message: parseResponseString(helpMessagesForDM.characterDoesNotExist, recipientCharacterName) })
        }
    }
}
