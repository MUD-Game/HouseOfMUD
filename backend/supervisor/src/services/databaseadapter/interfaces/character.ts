import { CharacterStats } from "./characterStats";
import { ItemInfo } from "./itemInfo";

export interface Character {
    name: string;
    userId: string;
    characterClass: string;
    characterSpecies: string;
    characterGender: string;
    maxStats: CharacterStats;
    currentStats: CharacterStats;
    position: string;
    exploredRooms: { [roomId: string]: boolean },
    inventory: ItemInfo[];

    getName(): string
    getPosition(): string
    modifyPosition(destinationRoom: string): any
    getInventory(): ItemInfo[]
    isDead(): boolean
    getCharakterStats(): CharacterStats
    getMaxStats(): CharacterStats
}

export class CharacterImpl implements Character {
    name: string;
    userId: string;
    characterClass: string;
    characterSpecies: string;
    characterGender: string;
    maxStats: CharacterStats;
    currentStats: CharacterStats;
    position: string;
    exploredRooms: { [roomId: string]: boolean };
    inventory: ItemInfo[];

    constructor(
        userId: string,
        name: string,
        className: string,
        species: string,
        gender: string,
        maxStats: CharacterStats,
        currentStats: CharacterStats,
        position: string,
        exploredRooms: { [roomId: string]: boolean },
        inventory: ItemInfo[]
    ) {
        this.userId = userId;
        this.name = name;
        this.characterClass = className;
        this.characterSpecies = species;
        this.characterGender = gender;
        this.maxStats = maxStats;
        this.currentStats = currentStats;
        this.position = position;
        this.exploredRooms = exploredRooms;
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
        this.exploredRooms[destinationRoom] = true;
    }

    getInventory(): ItemInfo[] {
        return this.inventory
    }

    isDead(): boolean {
        if (this.currentStats.hp > 0) {
            return false
        }
        else {
            return true
        }
    }

    getCharakterStats(): CharacterStats {
        return this.currentStats
    }

    getMaxStats(): CharacterStats {
        return this.maxStats
    }
}