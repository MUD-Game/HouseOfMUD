import { Schema } from "mongoose";

export interface CharacterGenderDataset {
  id: string;
  name: string;
  description: string;
}

export const characterGenderSchema = new Schema<CharacterGenderDataset>({
  id: { type: String, required: true },
  name: { type: String },
  description: { type: String },
});
