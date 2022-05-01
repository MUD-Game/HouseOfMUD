export interface CharacterGender {
    id: string;
    name: string;
    description: string;
}
  
export class CharacterGenderImpl implements CharacterGender {
    id: string;
    name: string;
    description: string;

    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}