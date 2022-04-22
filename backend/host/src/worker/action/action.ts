export interface Action {
    /**
     * Command user has to input to execute action.
     */
    trigger: string
    /**
     * Performs the action based on the given arguments. Overriden by action type.
     * @param user User that sent the action message.
     * @param args Arguments received by the ActionHandler.
     */
    performAction(user: string, args: string[]): any
}













