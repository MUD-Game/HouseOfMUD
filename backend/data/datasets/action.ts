import { Schema } from "mongoose";
import { ActionEvent } from "./actionEvent";

export interface Action {
  actionId: string;
  command: string;
  output: string;
  description: string;
  events: ActionEvent[];
  itemsneeded: string[];
}

export const actionSchema = new Schema<Action>({
  actionId: { type: String, required: true, unique: true },
  command: { type: String, required: true, unique: true },
  output: { type: String },
  description: { type: String },
  events: [{ type: Schema.Types.Mixed }],
  itemsneeded: [{ type: String }],
});
