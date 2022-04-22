import { Action } from "./action";

export class MessageAction implements Action {
    trigger: string;

    constructor() {
        this.trigger = "sag";
    }
    performAction(user: string, args: string) {
        return {routingKey: "Raum-1", payload: "payload"}
    }
}