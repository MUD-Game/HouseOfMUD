import {Schema, model} from "mongoose";
import { Item } from "./item";

export interface Action{
    id: string,
    command: string,
    output: string,
    description: string,
    events: ActionEvent[],
    itemsneeded: Item[]
}

const actionSchema = new Schema<Action>({
    command: {type: String, required: true, unique: true, maxLength: 15},
    output: {type: String, maxLength: 500},
    description: {type: String, maxLength: 500},
    events: {type: [ActionEvents], required: true},
    itemsneeded: {type: [Item]}
});

const action = model<Action>('Action', actionSchema);