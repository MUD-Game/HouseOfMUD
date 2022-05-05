import { Schema } from "mongoose";
import { ActionDataset } from "./actionDataset";
import { CharacterClassDataset } from "./characterClassDataset";
import { CharacterDataset } from "./characterDataset";
import { CharacterGenderDataset } from "./characterGenderDataset";
import { CharacterSpeciesDataset } from "./characterSpeciesDataset";
import { ItemDataset } from "./itemDataset";
import { NpcDataset } from "./npcDataset";
import { RoomDataset } from "./roomDataset";

export interface DungeonDataset {
  name: string;
  description: string;
  creatorId: string;
  masterId: string;
  maxPlayers: number;
  characters: CharacterDataset[];
  characterClasses: CharacterClassDataset[];
  characterSpecies: CharacterSpeciesDataset[];
  characterGenders: CharacterGenderDataset[];
  rooms: RoomDataset[];
  items: ItemDataset[];
  npcs: NpcDataset[];
  globalActions: string[];
  blacklist: string[];
  actions: ActionDataset[];
}

export const dungeonSchema = new Schema<DungeonDataset>({
  name: { type: String, maxLength: 50 },
  description: { type: String },
  creatorId: { type: String },
  masterId: { type: String },
  maxPlayers: { type: Number },
  characters: [{ type: Schema.Types.ObjectId, ref: "Character" }],
  characterClasses: [{ type: Schema.Types.ObjectId, ref: "CharacterClass" }],
  characterSpecies: [{ type: Schema.Types.ObjectId, ref: "CharacterSpecies" }],
  characterGenders: [{ type: Schema.Types.ObjectId, ref: "CharacterGender" }],
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  npcs: [{ type: Schema.Types.ObjectId, ref: "Npc" }],
  blacklist: [{ type: String }],
  actions: [{ type: Schema.Types.ObjectId, ref: "Action" }],
});