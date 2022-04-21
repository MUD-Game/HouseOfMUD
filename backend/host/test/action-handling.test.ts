import { ActionElement, Item } from "../src/dungeon/dungeon";
import { Event } from "../src/dungeon/dungeon";
import { ActionHandler } from "../src/worker/action/action-handler";
import { DungeonAction } from "../src/worker/action/dungeon-action";
import { MessageAction } from "../src/worker/action/message-action";
import UnspecifiedAction from "../src/worker/action/unspecified-action";

describe("Action Handler", () => {
    const actionHandler: ActionHandler = new ActionHandler([new ActionElement("1", "essen", "gegessen", "essen aktion", [new Event("addhp", 10)], [new Item("1", "Apfel", "Eine Frucht")])])
    test('ActionHandler should return an action of type MessageAction when it receives a "sag" action message', () => {
        expect(actionHandler.processAction("testUser", "sag Hallo")).toBeInstanceOf(MessageAction);
    })
    test('ActionHandler should return an action of type DungeonAction when it receives a non standard action message', () => {
        expect(actionHandler.processAction("testUser", "essen Apfel")).toBeInstanceOf(DungeonAction);
    })
    test('ActionHandler should return an action of type UnspecifiedAction when it receives a non specified action message', () => {
        expect(actionHandler.processAction("testUser", "angriff Monster")).toBeInstanceOf(UnspecifiedAction);
    })
})
