import { MongoTailableCursorError } from "mongodb";
import {Schema, model} from "mongoose";

export interface Npc{
    id: string,
    name: string,
    description: string,
    species: string
}

export const npcSchema = new Schema<Npc>({
    id: {type: String, required: true, unique: true},
    name: {type: String, maxLength: 50},
    description: {type: String, maxLength: 500},
    species: {type: String, maxLength: 50}
});