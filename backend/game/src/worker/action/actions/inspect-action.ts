import { Character, Dungeon, Item } from "../../../dungeon/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";

export class InspectAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = "untersuche";
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let dungeonId: string = dungeon.getId()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let characterInventory: string [] = senderCharacter.getInventory()
        let itemToInspect: string = args[0]
        let userHasItem: boolean = false;
        let inspectMessage: string = ''
        characterInventory.forEach(itemId => {
            let item: Item = dungeon.getItem(itemId)
            let itemName: string = item.getName()
            if (itemName === itemToInspect) {
                userHasItem = true
                let itemDescription: string = item.getDescription()
                inspectMessage = `Du untersuchst ${itemName}: ${itemDescription}`
            }
        })
        if (userHasItem) {
            this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: inspectMessage}})
        } else {
            this.dungeonController.getAmqpAdapter().sendToClient(user, {action: "message", data: {message: "Du besitzt dieses Item nicht!"}})
        }
        
    }

}