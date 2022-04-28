import { Schema } from "mongoose";

export interface CharacterSpeciesDataset {
  id: string;
  name: string;
  description: string;
}

export const characterSpeciesSchema = new Schema<CharacterSpeciesDataset>({
  id: { type: String, required: true },
  name: { type: String },
  description: { type: String },
});
