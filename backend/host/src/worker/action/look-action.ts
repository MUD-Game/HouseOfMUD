import { IAction } from "./action";

export class LookAction implements IAction {
    trigger: string;

    constructor() {
        this.trigger = "umschauen";
    }
    performAction(user: string, args: string) {
        throw new Error("Method not implemented.");
    }

}