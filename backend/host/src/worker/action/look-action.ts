import { Action } from "./action";

export class LookAction implements Action {
    trigger: string;

    constructor() {
        this.trigger = "umschauen";
    }
    performAction(user: string, args: string[]) {
        throw new Error("Method not implemented.");
    }

}