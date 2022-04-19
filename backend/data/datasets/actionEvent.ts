import {Schema, model} from "mongoose";

export interface ActionEvent{
    id: string,
    eventType: string,
    value: string
}

const actionEventSchema = new Schema<ActionEvent>({
    eventType: {type: String, enum: ['additem', 'removeitem', 'addhp', 'removehp', 'adddmg', 'removedmg', 'addmana', 'removemana']},
    description: {type: String, maxLength: 500}
});

const actionEvent = model<ActionEvent>('ActionEvent', actionEventSchema);
