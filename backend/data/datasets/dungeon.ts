import {Schema, model} from "mongoose";

export interface Dungeon{
    id: string,
    name: string,
    creator: Schema.Types.ObjectId,
    master: Schema.Types.ObjectId,
    maxPlayers: number,
    currentPlayers: number,
    characterClasses: Schema.Types.ObjectId[],
    characterSpezies: Schema.Types.ObjectId[],
    characterGender: Schema.Types.ObjectId[],
    rooms: Schema.Types.ObjectId[],
    blacklist: Schema.Types.ObjectId[],
    actions: Schema.Types.ObjectId[]
}

const dungeonSchema = new Schema<Dungeon>({
    name: {type: String, maxLength: 50},
    creator: {type: Schema.Types.ObjectId},
    master: {type: Schema.Types.ObjectId},
    maxPlayers: {type: Number},
    currentPlayers: {type: Number},
    characterClasses: {type: [Schema.Types.ObjectId]},
    characterSpezies: {type: [Schema.Types.ObjectId]},
    characterGender: {type: [Schema.Types.ObjectId]},
    rooms: {type: [Schema.Types.ObjectId]},
    blacklist: {type: [Schema.Types.ObjectId]},
    actions: {type: [Schema.Types.ObjectId]}
});

const dungeon = model<Dungeon>('Dungeon', dungeonSchema);
export default dungeon;