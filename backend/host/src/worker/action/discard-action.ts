import { IAction } from "./action";

export class DiscardAction implements IAction {
    trigger: string;

    constructor() {
        this.trigger = "ablegen";
    }

    performAction(user: string, args: string) {
        throw new Error("Method not implemented.");
    }

}