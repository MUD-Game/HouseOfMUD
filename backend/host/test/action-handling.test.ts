import { ActionElement, CharacterGender, CharacterSpecies, Character, Item, TestDungeon } from "../src/dungeon/dungeon";
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

beforeAll(() => {
    
})

describe("Action Handler", () => {
    const actionHandler: ActionHandler = new ActionHandler(TestDungeon.actions)
    const messageAction: MessageAction = actionHandler.actions.find(action => action instanceof MessageAction)!
    const privateMessageAction: PrivateMessageAction = actionHandler.actions.find(action => action instanceof PrivateMessageAction)!
    const discardAction: DiscardAction = actionHandler.actions.find(action => action instanceof DiscardAction)!
    const inspectAction: InspectAction = actionHandler.actions.find(action => action instanceof InspectAction)!
    const lookAction: LookAction = actionHandler.actions.find(action => action instanceof LookAction)!
    const moveAction: MoveAction = actionHandler.actions.find(action => action instanceof MoveAction)!
    const pickupAction: PickupAction = actionHandler.actions.find(action => action instanceof PickupAction)!
    const dungeonAction: DungeonAction = actionHandler.dungeonActions.find(action => action instanceof DungeonAction)!
    const unspecifiedAction: UnspecifiedAction = actionHandler.unspecifiedAction
    messageAction.performAction = jest.fn()
    privateMessageAction.performAction = jest.fn()
    discardAction.performAction = jest.fn()
    inspectAction.performAction = jest.fn()
    lookAction.performAction = jest.fn()
    moveAction.performAction = jest.fn()
    pickupAction.performAction = jest.fn()
    dungeonAction.performAction = jest.fn()
    unspecifiedAction.performAction = jest.fn()

    test('ActionHandler should return an action of type MessageAction when it receives a "sag" action message', () => {
        actionHandler.processAction("1", "sag Hallo")
        expect(messageAction.performAction).toHaveBeenCalledWith("1", ["Hallo"])
    })
    test('ActionHandler should return an action of type PrivateMessageAction when it receives a "fluester" action message', () => {
        actionHandler.processAction("1", "fluester Spieler Hallo")
        expect(privateMessageAction.performAction).toHaveBeenCalledWith("1", ["Spieler", "Hallo"])
    })
    test('ActionHandler should return an action of type DiscardAction when it receives a "ablegen" action message', () => {
        actionHandler.processAction("1", "ablegen Apfel")
        expect(discardAction.performAction).toHaveBeenCalledWith("1", ["Apfel"])
    })
    test('ActionHandler should return an action of type InspectAction when it receives a "untersuche" action message', () => {
        actionHandler.processAction("1", "untersuche Apfel")
        expect(inspectAction.performAction).toHaveBeenCalledWith("1", ["Apfel"])
    })
    test('ActionHandler should return an action of type LookAction when it receives a "umschauen" action message', () => {
        actionHandler.processAction("1", "umschauen")
        expect(lookAction.performAction).toHaveBeenCalledWith("1", [])
    })
    test('ActionHandler should return an action of type MoveAction when it receives a "gehe" action message', () => {
        actionHandler.processAction("1", "gehe Norden")
        expect(moveAction.performAction).toHaveBeenCalledWith("1", ["Norden"])
    })
    test('ActionHandler should return an action of type PickupAction when it receives a "aufheben" action message', () => {
        actionHandler.processAction("1", "aufheben Apfel")
        expect(pickupAction.performAction).toHaveBeenCalledWith("1", ["Apfel"])
    })
    test('ActionHandler should return an action of type DungeonAction when it receives a non standard action message', () => {
        actionHandler.processAction("1", "essen Apfel")
        expect(dungeonAction.performAction).toHaveBeenCalledWith("1", ["Apfel"])
    })
    test('ActionHandler should return an action of type UnspecifiedAction when it receives a non specified action message', () => {
        actionHandler.processAction("1", "angriff Monster")
        expect(unspecifiedAction.performAction).toHaveBeenCalledWith("1", ["Monster"])
    })
})

describe("Actions", () => {
    const messageAction: MessageAction = new MessageAction();
    //const character: Character = new Character("1", "1", "Jeff", "Magier", new CharacterSpecies("1", "Elf", "Elfiger Elf"), new CharacterGender())
    test("MessageAction should return correct routing key and payload", () => {
        messageAction.performAction(TestDungeon.characters[0].id, ["Hallo", "zusammen!"])
         
    })
})
        //     {
        //     routingKey: "Raum-1", 
        //     payload: {
        //         action: "message", 
        //         data: {
        //             message: "[Raum-1] Jeff sagt Hallo zusammen!"
        //         }
        //     }
        // }

