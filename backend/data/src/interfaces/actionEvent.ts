export interface ActionEvent {
    eventType:
      | "additem"
      | "removeItem"
      | "addhp"
      | "removehp"
      | "adddmg"
      | "removedmg"
      | "addmana"
      | "removemana";
    value: string;
}
  
export class ActionEventImpl implements ActionEvent {
    eventType:
        | "additem"
        | "removeItem"
        | "addhp"
        | "removehp"
        | "adddmg"
        | "removedmg"
        | "addmana"
        | "removemana";
    value: string;

    constructor(
        type:
        | "additem"
        | "removeItem"
        | "addhp"
        | "removehp"
        | "adddmg"
        | "removedmg"
        | "addmana"
        | "removemana",
        value: string
    ) {
        this.eventType = type;
        this.value = value;
    }
}