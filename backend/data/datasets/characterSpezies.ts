import {Schema, model} from "mongoose";

export interface CharacterSpezies{
    id: string,
    name: string,
    description: string
}

const characterSpeziesSchema = new Schema<CharacterSpezies>({
    name: {type: String, maxLength: 50},
    description: {type: String, maxLength: 500}
});

const characterSpezies = model<CharacterSpezies>('CharacterSpezies', characterSpeziesSchema);
export default characterSpezies;