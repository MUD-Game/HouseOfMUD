import { IAction } from "./action";

export class InspectAction implements IAction {
    trigger: string;

    constructor() {
        this.trigger = "untersuche";
    }
    performAction(user: string, args: string) {
        throw new Error("Method not implemented.");
    }

}