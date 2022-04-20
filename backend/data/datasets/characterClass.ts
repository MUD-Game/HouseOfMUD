import {Schema, model} from "mongoose";
import { CharacterStats } from "./charcterStats";

export interface CharacterClass{
    id: string,
    name: string,
    description: string,
    maxStats: CharacterStats,
    startStats: CharacterStats
}

const characterClassSchema = new Schema<CharacterClass>({
    name: {type: String, maxLength: 50},
    description: {type: String, maxLength: 500},
    maxStats: {type: Schema.Types.Mixed},
    startStats: {type: Schema.Types.Mixed}
});

const characterClass = model<CharacterClass>('CharacterClass', characterClassSchema);
export default characterClass;