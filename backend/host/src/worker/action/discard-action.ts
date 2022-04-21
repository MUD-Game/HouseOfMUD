import { Action } from "./action";

export class DiscardAction implements Action {
    trigger: string;

    constructor(trigger: string) {
        this.trigger = trigger;
    }

    performAction(user: string, args: string) {
        throw new Error("Method not implemented.");
    }

}