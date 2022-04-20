import {Schema, model} from "mongoose";

export interface CharacterSpecies{
    id: string,
    name: string,
    description: string
}

const characterSpeciesSchema = new Schema<CharacterSpecies>({
    name: {type: String, maxLength: 50},
    description: {type: String, maxLength: 500}
});

const characterSpezies = model<CharacterSpecies>('CharacterSpecies', characterSpeciesSchema);
export default characterSpezies;