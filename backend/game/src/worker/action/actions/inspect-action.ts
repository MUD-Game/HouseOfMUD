import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, errorMessages, parseResponseString, triggers } from "./action-resources";

export class InspectAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.inspect;
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let characterInventory: string [] = senderCharacter.getInventory()
        let itemToInspect: string = args.join(' ')
        let userHasItem: boolean = false;
        let inspectMessage: string = ''
        characterInventory.forEach(itemId => {
            let item: Item = dungeon.getItem(itemId)
            let itemName: string = item.getName()
            if (itemName === itemToInspect) {
                userHasItem = true
                let itemDescription: string = item.getDescription()
                inspectMessage = parseResponseString(actionMessages.inspect, itemToInspect, itemDescription)
            }
        })
        if (userHasItem) {
            this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: inspectMessage}})
        } else {
            this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: errorMessages.itemNotOwned}})
        }
    }
}