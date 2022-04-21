export interface IActionHandler {
    processAction(user: string, message: string): any
}

/**
 * Processes Actions received by the dungeon controller.
 */
export class ActionHandler implements IActionHandler {
    /**
     * Based on the received data in the message the ActionHandler performs the action on the corresponding action type. 
     * @param user User that sent the action message.
     * @param message Message data the user sent. Processes the data into arguments.
     */
    processAction(user: string, message: string) {
        throw new Error("Method not implemented.");
    }
}