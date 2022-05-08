export interface CharacterSpecies {
    id: string;
    name: string;
}
  
export class CharacterSpeciesImpl implements CharacterSpecies {
    id: string;
    name: string;

    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
    }
}