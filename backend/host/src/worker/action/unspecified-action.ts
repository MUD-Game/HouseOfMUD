import { Action } from "./action";

export default class UnspecifiedAction implements Action {
    trigger: string;

    constructor(trigger: string) {
        this.trigger = trigger;
    }
    performAction(user: string, args: string) {
        throw new Error("Method not implemented.");
    }
}
