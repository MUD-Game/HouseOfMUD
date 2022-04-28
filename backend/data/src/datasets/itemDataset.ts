import { Schema } from "mongoose";

export interface ItemDataset {
  id: string;
  name: string;
  description: string;
}

export const itemSchema = new Schema<ItemDataset>({
  id: { type: String, required: true },
  name: { type: String },
  description: { type: String },
});
