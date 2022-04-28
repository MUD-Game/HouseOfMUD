import { Schema } from "mongoose";
import { ActionEvent } from "../interfaces/actionEvent";

export interface ActionDataset {
  id: string;
  command: string;
  output: string;
  description: string;
  events: ActionEvent[];
  itemsneeded: string[];
}

export const actionSchema = new Schema<ActionDataset>({
  id: { type: String, required: true },
  command: { type: String, required: true },
  output: { type: String },
  description: { type: String },
  events: [{ type: Schema.Types.Mixed }],
  itemsneeded: [{ type: String }],
});
