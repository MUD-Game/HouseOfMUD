import { Schema } from "mongoose";
import { ConnectionInfo } from "./connectionInfo";
import { ItemInfo } from "./itemInfo";

export interface RoomDataset {
  id: string;
  name: string;
  description: string;
  npcs: string[];
  items: ItemInfo[];
  connections: ConnectionInfo;
  actions: string[];
  xCoordinate: number;
  yCoordinate: number;
}

export const roomSchema = new Schema<RoomDataset>({
  id: { type: String, required: true },
  name: { type: String },
  description: { type: String },
  npcs: [{ type: String }],
  items: [{ type: Schema.Types.Mixed }],
  connections: { type: Schema.Types.Mixed },
  actions: [{ type: String }],
  xCoordinate: { type: Number },
  yCoordinate: { type: Number },
});
