import { Character, Dungeon, Room } from "../../dungeon/dungeon";
import { amqpAdapter } from "../dungeon-controller";
import { Action } from "./action";

/**
 * Action that gets performed when user sends a "fluester" message.
 */
export class PrivateMessageAction implements Action {
    trigger: string;
    dungeon: Dungeon;

    constructor(dungeon: Dungeon) {
        this.trigger = "fluester";
        this.dungeon = dungeon
    }
    
    performAction(user: string, args: string[]) {
        let senderCharacter: Character = this.dungeon.getCharacter(user)
        let senderCharacterName: string = senderCharacter.getName()
        let senderCharacterId: string = senderCharacter.getId()
        let dungeonId: string = this.dungeon.getId()
        let room: Room = senderCharacter.getPosition()
        let routingKeySender = `${dungeonId}.character.${senderCharacterId}`
        let recipientCharacterName: string = args[0]
        try {
            let recipientCharacter: Character = this.dungeon.getCharacterByName(recipientCharacterName)
            let recipientCharacterPosition: Room = recipientCharacter.getPosition()
            let recipientCharacterId: string = recipientCharacter.getId()
            let routingKeyRecipient = `${dungeonId}.character.${recipientCharacterId}`
            if (recipientCharacterPosition.getId() === room.getId()) {
                args.shift()
                let messageBody: string = args.join(' ')
                let responseMessage: string = `[privat] ${senderCharacterName} -> ${recipientCharacterName}: ${messageBody}`
                amqpAdapter.sendToClient(routingKeySender, {action: "message", data: {message: responseMessage}})
                amqpAdapter.sendToClient(routingKeyRecipient, {action: "message", data: {message: responseMessage}})
            } else {
                amqpAdapter.sendToClient(routingKeySender, {action: "message", data: {message: `${recipientCharacterName} ist nicht in diesem Raum!`}})
            }
        } catch(e) {
            console.log(e)
            amqpAdapter.sendToClient(routingKeySender, {action: "message", data: {message: `Der Charakter ${recipientCharacterName} existiert nicht in diesem Dungeon!`}})
        }
        
    }
}