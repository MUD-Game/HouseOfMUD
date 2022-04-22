import { Action } from "./action";

export class InventoryAction implements Action {
    trigger: string;

    constructor() {
        this.trigger = "inv";
    }
    performAction(user: string, args: string) {
        throw new Error("Method not implemented.");
    }

}