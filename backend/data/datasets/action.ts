import {Schema, model} from "mongoose";

export interface Action{
    id: string,
    command: string,
    output: string,
    description: string,
    events: Schema.Types.ObjectId[],
    itemsneeded: Schema.Types.ObjectId[]
}

const actionSchema = new Schema<Action>({
    command: {type: String, required: true, unique: true, maxLength: 15},
    output: {type: String, maxLength: 500},
    description: {type: String, maxLength: 500},
    events: {type: [Schema.Types.ObjectId], ref: 'ActionEvent', required: true},
    itemsneeded: {type: [Schema.Types.ObjectId], ref: 'Item'}
});

const action = model<Action>('Action', actionSchema);
export default action;