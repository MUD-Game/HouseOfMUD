import {Schema, model} from "mongoose";

export interface User{
    id: string,
    username: string,
    password: string
}

const userSchema = new Schema<User>({
    username: {type: String, required: true},
    password: {type: String, required: true}
});

const user = model<User>('UserSchema', userSchema);
export default user;