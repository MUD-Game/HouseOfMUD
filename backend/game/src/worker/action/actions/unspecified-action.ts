import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Room } from "../../../data/interfaces/room";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, errorMessages, extras, parseResponseString, actionMessages } from "./action-resources";

export default class UnspecifiedAction extends Action {

    constructor(dungeonController: DungeonController) {
        super(triggers.unspecified, dungeonController);
    }

    performAction(user: string, args: string[]) {
        let messageBody: string = args.join(' ')
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let senderCharacterName: string = senderCharacter.getName()
        let roomId: string = senderCharacter.getPosition()
        let room: Room = dungeon.getRoom(roomId)
        let roomName: string = room.getName()
        this.dungeonController.getAmqpAdapter().sendActionToClient(user, "message", { message: parseResponseString(actionMessages.unspecifiedActionPlayer, messageBody)})
        this.dungeonController.getAmqpAdapter().sendActionToClient(extras.dungeonMasterId, "message", { message: parseResponseString(actionMessages.unspecifiedActionDungeonMaster, senderCharacterName, roomName, messageBody), player: senderCharacterName, room: roomName})
    }
}
