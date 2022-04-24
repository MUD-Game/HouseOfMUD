import { Schema } from "mongoose";

export interface User {
  id: string;
  username: string;
  password: string;
}

export const userSchema = new Schema<User>({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});