import { ActionElement, CharacterGender, CharacterSpecies, Character, Item } from "../src/dungeon/dungeon";
import { Event } from "../src/dungeon/dungeon";
import { ActionHandler } from "../src/worker/action/action-handler";
import { DiscardAction } from "../src/worker/action/discard-action";
import { DungeonAction } from "../src/worker/action/dungeon-action";
import { InspectAction } from "../src/worker/action/inspect-action";
import { LookAction } from "../src/worker/action/look-action";
import { MessageAction } from "../src/worker/action/message-action";
import { MoveAction } from "../src/worker/action/move-action";
import { PickupAction } from "../src/worker/action/pickup-action";
import { PrivateMessageAction } from "../src/worker/action/private-message-action";
import UnspecifiedAction from "../src/worker/action/unspecified-action";
import characterDataset from "../../../test/testdaten/Charakter.json"

beforeAll(() => {
    
})

describe("Action Handler", () => {
    const actionHandler: ActionHandler = new ActionHandler([new ActionElement("1", "essen", "gegessen", "essen aktion", [new Event("addhp", 10)], [new Item("1", "Apfel", "Eine Frucht")])])
    test('ActionHandler should return an action of type MessageAction when it receives a "sag" action message', () => {
        expect(actionHandler.processAction("1", "sag Hallo")).toBeInstanceOf(MessageAction);
    })
    test('ActionHandler should return an action of type PrivateMessageAction when it receives a "fluester" action message', () => {
        expect(actionHandler.processAction("1", "fluester Spieler Hallo")).toBeInstanceOf(PrivateMessageAction);
    })
    test('ActionHandler should return an action of type DiscardAction when it receives a "ablegen" action message', () => {
        expect(actionHandler.processAction("1", "ablegen Apfel")).toBeInstanceOf(DiscardAction);
    })
    test('ActionHandler should return an action of type InspectAction when it receives a "untersuche" action message', () => {
        expect(actionHandler.processAction("1", "untersuche Apfel")).toBeInstanceOf(InspectAction);
    })
    test('ActionHandler should return an action of type LookAction when it receives a "umschauen" action message', () => {
        expect(actionHandler.processAction("1", "umschauen")).toBeInstanceOf(LookAction);
    })
    test('ActionHandler should return an action of type MoveAction when it receives a "gehe" action message', () => {
        expect(actionHandler.processAction("1", "gehe Norden")).toBeInstanceOf(MoveAction);
    })
    test('ActionHandler should return an action of type PickupAction when it receives a "aufheben" action message', () => {
        expect(actionHandler.processAction("1", "aufheben Apfel")).toBeInstanceOf(PickupAction);
    })
    test('ActionHandler should return an action of type DungeonAction when it receives a non standard action message', () => {
        expect(actionHandler.processAction("1", "essen Apfel")).toBeInstanceOf(DungeonAction);
    })
    test('ActionHandler should return an action of type UnspecifiedAction when it receives a non specified action message', () => {
        expect(actionHandler.processAction("1", "angriff Monster")).toBeInstanceOf(UnspecifiedAction);
    })
})

describe("Actions", () => {
    const messageAction: MessageAction = new MessageAction();
    //const character: Character = new Character("1", "1", "Jeff", "Magier", new CharacterSpecies("1", "Elf", "Elfiger Elf"), new CharacterGender())
    const character = characterDataset.Character[0]
    test("MessageAction should return correct routing key and payload", () => {
        expect(messageAction.performAction(character.userId, "Hallo zusammen!")).toBe({routingKey: "Raum-1", payload: ""})
    })
})
