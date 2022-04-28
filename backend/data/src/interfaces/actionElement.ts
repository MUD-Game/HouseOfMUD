import { ActionEvent } from "./actionEvent";

export interface ActionElement {
    id: string;
    command: string;
    output: string;
    description: string;
    events: ActionEvent[];
    itemsneeded: string[];
  
    getCommand(): string
}
  
export class ActionElementImpl implements ActionElement {
    id: string;
    command: string;
    output: string;
    description: string;
    events: ActionEvent[];
    itemsneeded: string[];

    constructor(
    id: string,
    command: string,
    output: string,
    description: string,
    events: ActionEvent[],
    itemsneeded: string[]
    ) {
    (this.id = id),
        (this.command = command),
        (this.output = output),
        (this.description = description),
        (this.events = events),
        (this.itemsneeded = itemsneeded);
    }

    getCommand(): string {
        return this.command
    }
}