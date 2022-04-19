import {Schema, model} from "mongoose";

export interface Character{
    id: string,
    name: string,
    dungeon: Schema.Types.ObjectId,
    characterClass: Schema.Types.ObjectId,
    characterSpezies: Schema.Types.ObjectId,
    characterGender: Schema.Types.ObjectId,
    maxStats: Schema.Types.ObjectId,
    currentStats: Schema.Types.ObjectId,
    position: Schema.Types.ObjectId,
    inventory: Schema.Types.ObjectId[]
}

const characterSchema = new Schema<Character>({
    name: {type: String, maxLength: 50},
    dungeon: {type: Schema.Types.ObjectId},
    characterClass: {type: Schema.Types.ObjectId},
    characterSpezies: {type: Schema.Types.ObjectId},
    characterGender: {type: Schema.Types.ObjectId},
    maxStats: {type: Schema.Types.Mixed},
    currentStats: {type: Schema.Types.Mixed},
    position: {type: Schema.Types.ObjectId},
    inventory: {type: [Schema.Types.ObjectId]}
});

const character = model<Character>('Character', characterSchema);
export default character;