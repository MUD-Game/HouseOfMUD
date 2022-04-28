import { Schema } from "mongoose";
import { ActionElement } from "../interfaces/actionElement";
import { Character } from "../interfaces/character";
import { Dungeon } from "../interfaces/dungeon";
import { Item } from "../interfaces/item";
import { Npc } from "../interfaces/npc";
import { Room } from "../interfaces/room";
import { CharacterClassDataset } from "./characterClassDataset";
import { CharacterGenderDataset } from "./characterGenderDataset";
import { CharacterSpeciesDataset } from "./characterSpeciesDataset";

export interface DungeonDataset {
  name: string;
  description: string;
  creatorId: string;
  masterId: string;
  maxPlayers: number;
  characters: Character[];
  characterClasses: CharacterClassDataset[];
  characterSpecies: CharacterSpeciesDataset[];
  characterGenders: CharacterGenderDataset[];
  rooms: Room[];
  items: Item[];
  npcs: Npc[];
  blacklist: string[];
  actions: ActionElement[];
}

export const dungeonSchema = new Schema<Dungeon>({
  name: { type: String, maxLength: 50 },
  description: { type: String },
  creatorId: { type: String },
  masterId: { type: String },
  maxPlayers: { type: Number },
  characters: [{ type: Schema.Types.ObjectId, ref: "Character" }],
  characterClasses: [{ type: Schema.Types.ObjectId, ref: "CharacterClass" }],
  characterSpecies: [{ type: Schema.Types.ObjectId, ref: "CharacterSpecies" }],
  characterGenders: [{ type: Schema.Types.ObjectId, ref: "CharacterGenders" }],
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  npcs: [{ type: Schema.Types.ObjectId, ref: "Npc" }],
  blacklist: [{ type: String }],
  actions: [{ type: Schema.Types.ObjectId, ref: "Action" }],
});