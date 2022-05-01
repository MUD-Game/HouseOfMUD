import { CharacterStats } from "./characterStats";

export interface CharacterClass {
    id: string;
    name: string;
    description: string;
    maxStats: CharacterStats;
    startStats: CharacterStats;
}
  
export class CharacterClassImpl implements CharacterClass {
    id: string;
    name: string;
    description: string;
    maxStats: CharacterStats;
    startStats: CharacterStats;
  
    constructor(
      id: string,
      name: string,
      description: string,
      maxStats: CharacterStats,
      startStats: CharacterStats
    ) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.maxStats = maxStats;
      this.startStats = startStats;
    }
}