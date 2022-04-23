import { Dungeon } from "../../dungeon/dungeon"

export interface Action {
    /**
     * Command user has to input to execute action.
     */
    trigger: string
    dungeon: Dungeon
    /**
     * Performs the action based on the given arguments. Overriden by action type.
     * @param user CharacterId of the user that sent the action message.
     * @param args Arguments received by the ActionHandler.
     */
    performAction(user: string, args: string[]): any
}













