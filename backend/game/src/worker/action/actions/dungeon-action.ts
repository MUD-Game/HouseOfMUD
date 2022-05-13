import { Stats } from "fs";
import { ActionElement } from "../../../data/interfaces/actionElement";
import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { Item } from "../../../data/interfaces/item";
import { ItemInfo } from "../../../data/interfaces/itemInfo";
import { Room } from "../../../data/interfaces/room";
import { AmqpAdapter } from "../../amqp/amqp-adapter";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { actionMessages, characterStats, errorMessages, eventCases, operations, parseResponseString, triggers } from "./action-resources";

export class DungeonAction extends Action {
    regEx: RegExp
    actionElement: ActionElement

    constructor(trigger: string, dungeonController: DungeonController, actionElement: ActionElement) {
        super(trigger, dungeonController);
        let stringForRegEx: string = `^(${trigger})$`
        this.regEx = new RegExp(stringForRegEx, 'i')
        this.actionElement = actionElement
    }

    async performAction(user: string, args: string[]) {
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        let senderCharacter: Character = dungeon.getCharacter(user)
        let roomId: string = senderCharacter.getPosition()
        let room: Room = dungeon.getRoom(roomId)
        let roomActions: string[] = room.getActions()
        let globalActions: string [] = dungeon.getGlobalActions();
        if (roomActions.includes(this.actionElement.id) || globalActions.includes(this.actionElement.id)) {
            console.log('test1')
            let characterInventory: ItemInfo[] = senderCharacter.getInventory()
            let missingItems: string[] = this.returnMissingItems(characterInventory)
            if (missingItems.length === 0) {
                this.actionElement.events.forEach(actionEvent => {
                    // actionevent is item
                    if (actionEvent.eventType.toLowerCase().includes("item")) {
                        // actionevent is add
                        if (actionEvent.eventType.toLowerCase().includes(operations.add)) {
                            if (characterInventory.some(it => it.item == actionEvent.value)) {
                                let itemInInventory: ItemInfo = characterInventory.filter(it => it.item == actionEvent.value)[0]
                                itemInInventory.count += 1
                            } else {
                                characterInventory.push(new ItemInfo(actionEvent.value, 1))
                            }
                        // actionevent is remove
                        } else if (actionEvent.eventType.toLowerCase().includes(operations.remove)) {
                            let itemInInventory: ItemInfo = characterInventory.filter(it => it.item == actionEvent.value)[0]
                            if (itemInInventory.count > 1){
                                itemInInventory.count -= 1
                            } else {
                                let indexOfItemToDiscardInInventory: number = characterInventory.indexOf(itemInInventory)
                                characterInventory.splice(indexOfItemToDiscardInInventory, 1)
                            }
                        }
                    // actionevent is stats (hp, mana, dmg)
                    } else {
                        this.modifyCharacterStat(actionEvent.eventType, +actionEvent.value, senderCharacter)
                    }
                })
                await this.dungeonController.sendStatsData(user)
                await this.dungeonController.sendInventoryData(user)
                await amqpAdapter.sendActionToClient(user, 'message', { message: this.actionElement.output });    
            } else {
                let itemsMissingString: string = actionMessages.dungeonActionItemsMissing
                missingItems.forEach(missingItem => {
                    let item: Item = dungeon.getItem(missingItem)
                    let itemName: string = item.getName()
                    itemsMissingString += ` ${itemName}`
                })
                await amqpAdapter.sendActionToClient(user, 'message', { message: itemsMissingString });
            }
        } else {
            await amqpAdapter.sendActionToClient(user, 'message', {message: parseResponseString(errorMessages.actionDoesNotExist, triggers.showActions)});
        }
    }

    returnMissingItems(characterInventory: ItemInfo[]): string[] {
        let missingItems: string[] = []
        this.actionElement.itemsneeded.forEach(item => {
            if (characterInventory.some(itemInInventory => itemInInventory.item === item)) {
                return;
            } else {
                missingItems.push(item)
            }
        })
        return missingItems;
    }

    modifyCharacterStat(eventType: string, value: number, character: Character) {
        let actualValue: number = 0
        let maxValue: number = 0
        let valueCount: number = 0
        let setValue = function(valueToSet: number) {
            console.log("Error")
        };
        // actionEvent is hp
        if (eventType.toLowerCase().includes(characterStats.hp)) {
            actualValue = character.getCharakterStats().getHp()
            maxValue = character.getMaxStats().getHp()
            valueCount = value
            setValue = function(valueToSet: number) {
                character.getCharakterStats().setHp(valueToSet)
            }
        // actionEvent is mana
        } else if (eventType.toLowerCase().includes(characterStats.mana)) {
            actualValue = character.getCharakterStats().getMana()
            maxValue = character.getMaxStats().getMana()
            valueCount = value
            setValue = function(valueToSet: number) {
                character.getCharakterStats().setMana(valueToSet)
            }
        // actionevent is dmg
        } else if (eventType.toLowerCase().includes(characterStats.dmg)) {
            actualValue = character.getCharakterStats().getDmg()
                maxValue = character.getMaxStats().getDmg()
                valueCount = value
                setValue = function(valueToSet: number) {
                    character.getCharakterStats().setDmg(valueToSet)
                }
        }
        // actionevent is add
        if (eventType.toLowerCase().includes(operations.add)) {
            if (maxValue - actualValue >= valueCount) {
                actualValue = actualValue + valueCount 
                setValue(actualValue)
            } else if (maxValue - actualValue < valueCount) {
                setValue(maxValue)
            }
        // actionevent is remove
        } else if (eventType.toLowerCase().includes(operations.remove)) {
            if (actualValue - valueCount >= 0) {
                actualValue = actualValue - valueCount 
                setValue(actualValue)
            } else if (actualValue - valueCount < 0) {
                setValue(0)
            }
        }  
    }
}