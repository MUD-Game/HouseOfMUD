import { IAction } from "./action";

export class PickupAction implements IAction {
    trigger: string;

    constructor(trigger: string) {
        this.trigger = trigger;
    }
    performAction(user: string, args: string) {
        throw new Error("Method not implemented.");
    }

}