import { CharacterStats } from "./characterStats";
import { ItemInfo } from "./itemInfo";

export interface Character {
    name: string;
    userId: string;
    dungeonId: string;
    characterClass: string;
    characterSpecies: string;
    characterGender: string;
    maxStats: CharacterStats;
    currentStats: CharacterStats;
    position: string;
    inventory: ItemInfo[];
  
    getName(): string
    getPosition(): string
    modifyPosition(destinationRoom: string): any
    getInventory(): ItemInfo[]
<<<<<<< HEAD
    isDead(): boolean
=======
    getCharakterStats(): CharacterStats
    getMaxStats(): CharacterStats
>>>>>>> dev
}

export class CharacterImpl implements Character {
    name: string;
    userId: string;
    dungeonId: string;
    characterClass: string;
    characterSpecies: string;
    characterGender: string;
    maxStats: CharacterStats;
    currentStats: CharacterStats;
    position: string;
    inventory: ItemInfo[];

    constructor(
        userId: string,
        dungeonId: string,
        name: string,
        className: string,
        species: string,
        gender: string,
        maxStats: CharacterStats,
        currentStats: CharacterStats,
        position: string,
        inventory: ItemInfo[]
    ) {
        this.userId = userId;
        this.dungeonId = dungeonId;
        this.name = name;
        this.characterClass = className;
        this.characterSpecies = species; 
        this.characterGender = gender;
        this.maxStats = maxStats;
        this.currentStats = currentStats;
        this.position = position;
        this.inventory = inventory;
    }

    getName(): string {
        return this.name;
    }

    getPosition(): string {
        return this.position;
    }

    modifyPosition(destinationRoom: string): any {
        this.position = destinationRoom;
    }

    getInventory(): ItemInfo[] {
        return this.inventory
    }
<<<<<<< HEAD

    isDead(): boolean {
        if(this.currentStats.hp > 0){
            return false
        }
        else {
            return true
        }
=======
    getCharakterStats(): CharacterStats {
        return this.currentStats
    }
    getMaxStats(): CharacterStats {
        return this.maxStats
>>>>>>> dev
    }
}