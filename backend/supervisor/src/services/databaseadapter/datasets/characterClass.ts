import { Schema } from "mongoose";
import { CharacterStats } from "./charcterStats";

export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  maxStats: CharacterStats;
  startStats: CharacterStats;
}

export const characterClassSchema = new Schema<CharacterClass>({
  id: { type: String, required: true },
  name: { type: String },
  description: { type: String },
  maxStats: { type: Schema.Types.Mixed },
  startStats: { type: Schema.Types.Mixed },
});
