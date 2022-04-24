import { Schema } from "mongoose";
import { ConnectionInfo } from "./connectionInfo";

export interface Room {
  id: string;
  name: string;
  description: string;
  npcs: string[];
  items: string[];
  connections: ConnectionInfo;
  actions: string[];
  xCoordinate: number;
  yCoordinate: number;
}

export const roomSchema = new Schema<Room>({
  id: { type: String, required: true },
  name: { type: String },
  description: { type: String },
  npcs: [{ type: String }],
  items: [{ type: String }],
  connections: { type: Schema.Types.Mixed },
  actions: [{ type: String }],
  xCoordinate: { type: Number },
  yCoordinate: { type: Number },
});
