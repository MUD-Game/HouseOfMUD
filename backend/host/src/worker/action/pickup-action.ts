import { Action } from "./action";

export class PickupAction implements Action {
    trigger: string;

    constructor() {
        this.trigger = "aufheben";
    }
    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
    }

}