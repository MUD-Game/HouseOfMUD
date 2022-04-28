import { Schema } from "mongoose";

export interface User {
  // id: string;
  username: string;
  email: string;
  password: string;
}

export const userSchema = new Schema<User>({
  // id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});