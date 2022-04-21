import { IAction } from "./action";

export class PrivateMessageAction implements IAction {
    trigger: string;

    constructor() {
        this.trigger = "fluester";
    }
    performAction(user: string, args: string) {
        throw new Error("Method not implemented.");
    }
}