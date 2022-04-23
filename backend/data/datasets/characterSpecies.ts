import { Schema } from "mongoose";

export interface CharacterSpecies {
  characterSpeciesId: string;
  name: string;
  description: string;
}

export const characterSpeciesSchema = new Schema<CharacterSpecies>({
  characterSpeciesId: { type: String, required: true, unique: true },
  name: { type: String },
  description: { type: String },
});
