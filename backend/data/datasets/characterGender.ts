import { Schema } from "mongoose";

export interface CharacterGender {
  characterGenderId: string;
  name: string;
  description: string;
}

export const characterGenderSchema = new Schema<CharacterGender>({
  characterGenderId: { type: String, required: true, unique: true },
  name: { type: String },
  description: { type: String },
});
