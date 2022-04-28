import { Schema } from "mongoose";
import { CharacterStats } from "./charcterStats";

export interface CharacterDataset {
  id: string;
  name: string;
  userId: string;
  dungeonId: string;
  characterClass: string;
  characterSpecies: string;
  characterGender: string;
  maxStats: CharacterStats;
  currentStats: CharacterStats;
  position: string;
  inventory: string[];
}

export const characterSchema = new Schema<CharacterDataset>({
  id: { type: String, required: true },
  name: { type: String },
  userId: { type: String },
  dungeonId: { type: String },
  characterClass: { type: String },
  characterSpecies: { type: String },
  characterGender: { type: String },
  maxStats: { type: Schema.Types.Mixed },
  currentStats: { type: Schema.Types.Mixed },
  position: { type: String },
  inventory: [{ type: String }],
});
