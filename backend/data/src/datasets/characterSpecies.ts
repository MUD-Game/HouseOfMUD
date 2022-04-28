import { Schema } from "mongoose";

export interface CharacterSpecies {
  id: string;
  name: string;
  description: string;
}

export const characterSpeciesSchema = new Schema<CharacterSpecies>({
  id: { type: String, required: true },
  name: { type: String },
  description: { type: String },
});
