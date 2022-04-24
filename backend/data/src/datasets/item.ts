import { Schema } from "mongoose";

export interface Item {
  id: string;
  name: string;
  description: string;
}

export const itemSchema = new Schema<Item>({
  id: { type: String, required: true, unique: true },
  name: { type: String },
  description: { type: String },
});
