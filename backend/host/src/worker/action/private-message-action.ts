import { Action } from "./action";

export class PrivateMessageAction implements Action {
    trigger: string;

    constructor() {
        this.trigger = "fluester";
    }
    performAction(user: string, args: string) {
        throw new Error("Method not implemented.");
    }
}