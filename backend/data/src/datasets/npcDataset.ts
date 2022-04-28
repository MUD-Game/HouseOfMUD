import { MongoTailableCursorError } from "mongodb";
import {Schema, model} from "mongoose";
import { Npc } from "../interfaces/npc";

export interface NpcDataset{
    id: string,
    name: string,
    description: string,
    species: string
}

export const npcSchema = new Schema<Npc>({
    id: {type: String, required: true },
    name: {type: String, maxLength: 50},
    description: {type: String, maxLength: 500},
    species: {type: String, maxLength: 50}
});