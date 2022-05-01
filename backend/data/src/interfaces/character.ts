import { CharacterStats } from "./characterStats";

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
    inventory: string[];
  
    getName(): string
    getPosition(): string
    modifyPosition(destinationRoom: string): any
    getInventory(): string[]
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
    inventory: string[];

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
        inventory: string[]
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

    getInventory(): string[] {
        return this.inventory
    }
}