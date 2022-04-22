import { Action } from "./action";

export class InspectAction implements Action {
    trigger: string;

    constructor() {
        this.trigger = "untersuche";
    }
    performAction(user: string, args: string) {
        throw new Error("Method not implemented.");
    }

}