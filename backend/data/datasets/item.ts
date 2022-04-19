import {Schema, model} from "mongoose";

export interface Item{
    id: string,
    name: string,
    description: string
}

const itemSchema = new Schema<Item>({
    name: {type: String, maxLength: 50},
    description: {type: String, maxLength: 500}
});

const item = model<Item>('Item', itemSchema);
export default item;