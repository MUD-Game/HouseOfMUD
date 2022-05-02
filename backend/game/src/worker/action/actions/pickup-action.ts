import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { Room } from "../../../data/interfaces/room";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, errorMessages, parseResponseString, triggers } from "./action-resources";

export class PickupAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.pickup;
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let nameOfItemToPickup: string = args.join(' ')
        let characterInventory: string[] = senderCharacter.getInventory()
        let idOfCharacterPosition: string = senderCharacter.getPosition()
        let characterPosition: Room = dungeon.getRoom(idOfCharacterPosition)
        let roomItems: string[] = characterPosition.getItems()
        try {
            let itemToPickup: Item = dungeon.getItemByName(nameOfItemToPickup)
            let idOfitemToPickup: string = itemToPickup.getId()
            if (roomItems.includes(idOfitemToPickup)) {
                let indexOfitemToPickup: number = roomItems.indexOf(idOfitemToPickup)
                roomItems.splice(indexOfitemToPickup, 1)
                characterInventory.push(idOfitemToPickup)
                this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: parseResponseString(actionMessages.pickup, nameOfItemToPickup)}})
            } else {
                this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: errorMessages.itemNotInRoom}})
            }
        } catch(e) {
            console.log(e)
            this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: errorMessages.itemNotInRoom}})
        }
    }

}