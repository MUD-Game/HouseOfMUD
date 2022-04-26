import { Schema } from "mongoose";

export interface CharacterGender {
  id: string;
  name: string;
  description: string;
}

export const characterGenderSchema = new Schema<CharacterGender>({
  id: { type: String, required: true },
  name: { type: String },
  description: { type: String },
});
