import { ActionEvent } from "./actionEvent";
import { ItemInfo } from "./itemInfo";

export interface ActionElement {
    id: string;
    command: string;
    output: string;
    description: string;
    events: ActionEvent[];
    itemsneeded: ItemInfo[];
  
    getCommand(): string
}
  
export class ActionElementImpl implements ActionElement {
    id: string;
    command: string;
    output: string;
    description: string;
    events: ActionEvent[];
    itemsneeded: ItemInfo[];

    constructor(
    id: string,
    command: string,
    output: string,
    description: string,
    events: ActionEvent[],
    itemsneeded: ItemInfo[]
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