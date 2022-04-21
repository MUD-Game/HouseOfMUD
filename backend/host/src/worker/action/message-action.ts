import { IAction } from "./action";

export class MessageAction implements IAction {
    trigger: string;

    constructor() {
        this.trigger = "sag";
    }
    performAction(user: string, args: string) {
        
    }
}