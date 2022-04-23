import { Schema } from "mongoose";

export interface User {
  userId: string;
  username: string;
  password: string;
}

export const userSchema = new Schema<User>({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});