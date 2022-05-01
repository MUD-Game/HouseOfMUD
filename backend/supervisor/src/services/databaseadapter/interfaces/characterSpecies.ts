export interface CharacterSpecies {
    id: string;
    name: string;
    description: string;
}
  
export class CharacterSpeciesImpl implements CharacterSpecies {
    id: string;
    name: string;
    description: string;

    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}