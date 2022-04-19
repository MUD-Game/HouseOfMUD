import {Schema, model} from "mongoose";

export interface ActionEvent{
    id: string,
    eventType: string,
    value: string
}

const actionEventSchema = new Schema<ActionEvent>({
    eventType: {type: String, required: true},
    value: {type: String, required: true}
});

const actionEvent = model<ActionEvent>('ActionEvent', actionEventSchema);
export default actionEvent;