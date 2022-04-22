import { Action } from "./action";

/**
 * Action that gets performed when user sends a "sag" message.
 */
export class MessageAction implements Action {
    trigger: string;

    constructor() {
        this.trigger = "sag";
    }
    performAction(user: string, args: string[]) {
        return {routingKey: "Raum-1", 
        payload: {
            action: "message", 
            data: {
                message: "[Raum-1] Jeff sagt Hallo zusammen!"}
            }
        }
    }
}