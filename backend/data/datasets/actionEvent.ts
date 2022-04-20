import {Schema, model} from "mongoose";

export interface ActionEvent{
    id: string,
    eventType: string,
    value: string
}

export const actionEventSchema = new Schema<ActionEvent>({
    eventType: {type: String, required: true}, //TODO enum hinzufügen
    value: {type: String, required: true}
});

const actionEvent = model<ActionEvent>('ActionEvent', actionEventSchema);
export default actionEvent;