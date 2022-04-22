import { Action } from "./action";

/**
 * Action that gets performed when user sends a "fluester" message.
 */
export class PrivateMessageAction implements Action {
    trigger: string;

    constructor() {
        this.trigger = "fluester";
    }
    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
    }
}