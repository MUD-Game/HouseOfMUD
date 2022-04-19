import {Schema, model} from "mongoose";
import { ConnectionInfo } from "./connectionInfo";

export interface Room{
    id: string,
    name: string,
    description: string,
    npcs: Schema.Types.ObjectId[],
    items: Schema.Types.ObjectId[],
    connections: ConnectionInfo,
    actions: Schema.Types.ObjectId[]
}

const roomSchema = new Schema<Room>({
    name: {type: String, maxLength: 50},
    description: {type: String, maxLength: 500},
    npcs: {type: [Schema.Types.ObjectId]},
    items: {type: [Schema.Types.ObjectId]},
    connections: {type: Schema.Types.Mixed},
    actions: {type : [Schema.Types.ObjectId]}
});

const room = model<Room>('Room', roomSchema);
export default room;