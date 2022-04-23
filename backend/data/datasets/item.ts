import { Schema } from "mongoose";

export interface Item {
  itemId: string;
  name: string;
  description: string;
}

export const itemSchema = new Schema<Item>({
  itemId: { type: String, required: true, unique: true },
  name: { type: String },
  description: { type: String },
});
