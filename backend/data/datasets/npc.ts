import {Schema, model} from "mongoose";

export interface Npc{
    id: string,
    name: string,
    description: string,
    species: string
}

const npcSchema = new Schema<Npc>({
    name: {type: String, maxLength: 50},
    description: {type: String, maxLength: 500},
    species: {type: String, maxLength: 50}
});

const npc = model<Npc>('Npc', npcSchema);
export default npc;