import { IAction } from "./action";

export class MoveAction implements IAction {
    trigger: string;

    constructor() {
        this.trigger = "gehe";
    }
    performAction(user: string, args: string) {
        throw new Error("Method not implemented.");
    }

}
