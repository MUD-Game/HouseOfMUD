import { Character } from "../../../data/interfaces/character";
import { Dungeon } from "../../../data/interfaces/dungeon";
import { DungeonController } from "../../controller/dungeon-controller";
import { Action } from "../action";
import { triggers, actionMessages, errorMessages, parseResponseString, extras } from "../actions/action-resources";
import { AmqpAdapter } from "../../amqp/amqp-adapter";


export class AddDamage implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.inspect;
        this.dungeonController = dungeonController
    }
    performAction(user: string, args: string[]) {
        let dungeon: Dungeon = this.dungeonController.getDungeon()
        //let senderCharacter: Character = dungeon.getCharacter(user)
        let recipientCharacterName: string = args[0]
        args.shift()
        let amqpAdapter: AmqpAdapter = this.dungeonController.getAmqpAdapter()
        
        let messageBody: string = args.join(' ')
        try {
            let recipientCharacter: Character = dungeon.getCharacter(recipientCharacterName)


            if (user === extras.dungeonMasterId) { //was ist damit (um alles rum oder ganz weglassen ?)
               
                let actualDmg: number = recipientCharacter.getCharakterStats().getDmg()
                let maxDmg: number = recipientCharacter.getMaxStats().getDmg()
                try{
                    let dmgCount: number = +args[0]

                    if(maxDmg-actualDmg>=dmgCount){
                        actualDmg = actualDmg + dmgCount // hier 
                    } else if(maxDmg-actualDmg<dmgCount){
                        actualDmg = maxDmg // und hier wird des ja nicht auf richtige var zugreifen sonder nnur kopie
                    }

                }catch(e){
                    console.log(e)
                    amqpAdapter.sendToClient(user, {action: "message", data: {message: parseResponseString(errorMessages.characterDoesNotExist, recipientCharacterName)}}) //hier muss man das zu "argument is no number machen"
                }
                
    
            } 
        } catch(e) {
            console.log(e)
            amqpAdapter.sendToClient(user, {action: "message", data: {message: parseResponseString(errorMessages.characterDoesNotExist, recipientCharacterName)}})
        }
    }
}
