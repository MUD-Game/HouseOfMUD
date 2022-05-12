import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, errorMessages, dungeonMasterSendMessages, parseResponseString, extras, helpMessagesForDM } from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { Room } from "../../../data/interfaces/room";


export class RemoveMana implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.removeMana;
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
            let manaCount: number = +args[1]
            try {
                if (isNaN(manaCount)) {
                    throw new Error('Value is not a number!')
                }
                if (actualMana - manaCount <= 0) {
                    manastring = parseResponseString(dungeonMasterSendMessages.removeMana, (actualMana).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message", { message: manastring })

                    manastring = parseResponseString(dungeonMasterSendMessages.ManaRemoved, recipientCharacter.name , (actualMana).toString())
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: manastring, room: roomName } )

                    recipientCharacter.getCharakterStats().setMana(0)

                } else if (actualMana - manaCount > 0) {
                    actualMana = actualMana - manaCount 
                    recipientCharacter.getCharakterStats().setMana(actualMana)
                    
                    manastring = parseResponseString(dungeonMasterSendMessages.removeMana, args[1])
                    this.dungeonController.getAmqpAdapter().sendActionToClient(recipientCharacter.name, "message",{ message: manastring })

                    manastring = parseResponseString(dungeonMasterSendMessages.ManaRemoved, recipientCharacter.name , args[1])
                    this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: manastring, room: roomName })
                }
                await this.dungeonController.sendStatsData(recipientCharacter.name)

            } catch(e) {
                amqpAdapter.sendActionToClient(user, "message", { message: helpMessagesForDM.valueNotANumber, room: roomName})
            }

        } catch (e) {
            //console.log(e)
            amqpAdapter.sendActionToClient(user, "message", { message: parseResponseString(helpMessagesForDM.characterDoesNotExist, recipientCharacterName) })
        }
    }
}
