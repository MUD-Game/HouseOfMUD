import { Schema } from "mongoose";
import { CharacterStats } from "./charcterStats";

export interface Character {
  id: string;
  name: string;
  userId: string;
  dungeonId: string;
  characterClass: string;
  characterSpezies: string;
  characterGender: string;
  maxStats: CharacterStats;
  currentStats: CharacterStats;
  position: string;
  inventory: string[];
}

export const characterSchema = new Schema<Character>({
  id: { type: String, required: true, unique: true },
  name: { type: String },
  userId: { type: String },
  dungeonId: { type: String },
  characterClass: { type: String },
  characterSpezies: { type: String },
  characterGender: { type: String },
  maxStats: { type: Schema.Types.Mixed },
  currentStats: { type: Schema.Types.Mixed },
  position: { type: String },
  inventory: [{ type: String }],
});
