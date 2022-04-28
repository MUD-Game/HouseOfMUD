export interface Npc {
    id: string;
    name: string;
    description: string;
    species: string;
  
    getName(): string
}
  
export class NpcImpl implements Npc {
    id: string;
    name: string;
    description: string;
    species: string;

    constructor(id: string, name: string, description: string, species: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.species = species;
    }

    getName(): string {
        return this.name
    }
}