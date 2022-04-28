import { Schema } from "mongoose";

export interface NpcDataset{
    id: string,
    name: string,
    description: string,
    species: string
}

export const npcSchema = new Schema<NpcDataset>({
    id: {type: String, required: true },
    name: {type: String, maxLength: 50},
    description: {type: String, maxLength: 500},
    species: {type: String, maxLength: 50}
});