import { Action } from '../action';
import { DungeonController, DUNGEONMASTER } from '../../controller/dungeon-controller';
import { triggers } from '../actions/action-resources';
import { AmqpAdapter } from '../../amqp/amqp-adapter';

export class DmGiveUpAction implements Action {
    trigger: string;
    dungeonController: DungeonController;

    constructor(dungeonController: DungeonController) {
        this.trigger = triggers.dmgiveup;
        this.dungeonController = dungeonController
    }

    performAction(user: string, args: string[]) {
        console.log('Not implemented')
    }

    async changeDungeonMaster(character: string){
        // Get user id from the character
        if(!this.dungeonController.characterExists(character)){
            return;
        }
        let newDungeonMasterId: string = this.dungeonController.getUserIdFromCharacter(character);
        // Change the dungeon master 
        this.dungeonController.getDungeon().setMasterId(newDungeonMasterId);
        this.dungeonController.getDungeon().setIsMasterless(true);
        // Kick the old dungeonmaster from the game without stopping the dungeon
        this.dungeonController.kickPlayer(DUNGEONMASTER, {
            kickMessage: "Du hast die Dungeonmaster-Rolle übergeben!",
            type: "dmgiveup"
        });

        // Send the new dungeonmaster to the game
        this.dungeonController.getAmqpAdapter().sendActionToClient(character, "newdm", { verifyToken: this.dungeonController.getDungeonMasterToken()});

        this.dungeonController.getAmqpAdapter().broadcastAction("message",`${character} ist nun der neue Dungeon Master`);

    }
}