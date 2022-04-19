import {Schema, model} from "mongoose";

export interface CharacterGender{
    id: string,
    name: string,
    description: string
}

const characterGenderSchema = new Schema<CharacterGender>({
    name: {type: String, maxLength: 50},
    description: {type: String, maxLength: 500}
});

const characterGender = model<CharacterGender>('CharacterGender', characterGenderSchema);
export default characterGender;