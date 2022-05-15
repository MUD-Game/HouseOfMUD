import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, errorMessages, dungeonMasterSendMessages, parseResponseString, extras, helpMessagesForDM, dmActionDescriptions } from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { Room } from "../../../data/interfaces/room";


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
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let roomstring: string = ''
        try {
            let recipientCharacter: Character = dungeon.getCharacter(recipientCharacterName)
            let actualroomId: string = recipientCharacter.getPosition()
            let actualroom: Room = dungeon.getRoom(actualroomId)
            let actualroomName: string = actualroom.getName()
            try {
                let newRoom: string = args[1]
                let newRoomObject: Room = dungeon.getRoomByName(newRoom)
                let newRoomId: string = newRoomObject.getId()
                if (actualroomName == newRoom) {
                    roomstring = parseResponseString(dungeonMasterSendMessages.alreadyRoom)
                    this.dungeonController.getAmqpAdapter().sendToClient(user, { action: "message", data: { message: roomstring, room: newRoom } })
                } else if (actualroomName !== newRoom) {
                    recipientCharacter.modifyPosition(newRoomId)
                    roomstring = parseResponseString(dungeonMasterSendMessages.dmRoomMove, recipientCharacterName , args[1])
                    this.dungeonController.getAmqpAdapter().sendToClient(user, { action: "message", data: { message: roomstring, room: newRoom } })
                    roomstring = parseResponseString(dungeonMasterSendMessages.roomMove, args[1])
                    this.dungeonController.getAmqpAdapter().sendToClient(recipientCharacter.name, { action: "message", data: { message: roomstring } })
                }
                await amqpAdapter.sendActionToClient(recipientCharacterName, 'minimap.move', newRoomId);
                this.dungeonController.sendPlayerListToDM();
            } catch (e) {
                //console.log(e)
                let availableRoomsString: string = '';
                Object.values(dungeon.rooms).forEach(room => {
                    let roomName: string = room.getName()
                    availableRoomsString += `\n\t${roomName}`
                })
                this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(helpMessagesForDM.roomDoesNotExist, availableRoomsString) + dmActionDescriptions.changeRoom})
            }

        } catch (e) {
            //console.log(e)
            this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", {message: parseResponseString(helpMessagesForDM.characterDoesNotExist, recipientCharacterName) + dmActionDescriptions.changeRoom})
        }
    }
}
