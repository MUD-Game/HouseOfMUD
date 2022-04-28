import { Schema } from "mongoose";
import { CharacterStats } from "./charcterStats";

export interface CharacterClassDataset {
  id: string;
  name: string;
  description: string;
  maxStats: CharacterStats;
  startStats: CharacterStats;
}

export const characterClassSchema = new Schema<CharacterClassDataset>({
  id: { type: String, required: true },
  name: { type: String },
  description: { type: String },
  maxStats: { type: Schema.Types.Mixed },
  startStats: { type: Schema.Types.Mixed },
});
