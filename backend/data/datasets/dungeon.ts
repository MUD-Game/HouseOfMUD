import { Schema } from "mongoose";
import { Action } from "./action";
import { Character } from "./character";
import { CharacterClass } from "./characterClass";
import { CharacterGender } from "./characterGender";
import { CharacterSpecies } from "./characterSpecies";
import { Item } from "./item";
import { Npc } from "./npc";
import { Room } from "./room";

export interface Dungeon {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  masterId: string;
  maxPlayers: number;
  currentPlayers: number;
  characters: Character[];
  characterClasses: CharacterClass[];
  characterSpecies: CharacterSpecies[];
  characterGender: CharacterGender[];
  rooms: Room[];
  items: Item[];
  npcs: Npc[];
  blacklist: string[];
  actions: Action[];
}

export const dungeonSchema = new Schema<Dungeon>({
  id: { type: String, required: true, unique: true },
  name: { type: String, maxLength: 50 },
  description: { type: String },
  creatorId: { type: String },
  masterId: { type: String },
  maxPlayers: { type: Number },
  currentPlayers: { type: Number },
  characters: [{ type: Schema.Types.ObjectId, ref: "Character" }],
  characterClasses: [{ type: Schema.Types.ObjectId, ref: "CharacterClass" }],
  characterSpecies: [{ type: Schema.Types.ObjectId, ref: "CharacterSpecies" }],
  characterGender: [{ type: Schema.Types.ObjectId, ref: "CharacterGender" }],
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  npcs: [{ type: Schema.Types.ObjectId, ref: "Npc" }],
  blacklist: [{ type: String }],
  actions: [{ type: Schema.Types.ObjectId, ref: "Action" }],
});