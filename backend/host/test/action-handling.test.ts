import { ActionElement, CharacterGender, CharacterSpecies, Character, Item, CharacterStats, CharacterClass, Npc, ConnectionInfo, Room, Dungeon} from "../src/dungeon/dungeon";
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
import { amqpAdapter } from "../src/worker/dungeon-controller";

const TestSpecies: CharacterSpecies = new CharacterSpecies("1", "Hexer", "Hexiger Hexer")
const TestStartStats: CharacterStats = new CharacterStats(100, 20, 100)
const TestMaxStats: CharacterStats = new CharacterStats(100, 20, 100)
const TestGender: CharacterGender = new CharacterGender("1", "Mann", "Maennlicher Mann")
const TestClass: CharacterClass = new CharacterClass("1", "Magier", "Magischer Magier", TestMaxStats, TestStartStats)
const TestNpc: Npc = new Npc("1", "Bernd", "Bernd liebt die Musik", "Barde")
const TestItem: Item = new Item("1", "Apfel", "Apfliger Apfel")
const TestConnections: ConnectionInfo = new ConnectionInfo("active", "active")
const TestAction: ActionElement = new ActionElement("1", "essen", "gegessen", "essen aktion", [new Event("addhp", 10)], [new Item("1", "Apfel", "Eine Frucht")])
const TestRoom: Room = new Room("1", "Raum-1", "Der Raum in dem alles begann", [TestNpc], [TestItem], TestConnections, [TestAction])
const TestCharacter: Character = new Character("1", "1", "1", "Jeff", "Magier", TestSpecies, TestGender, TestMaxStats, TestStartStats, TestRoom, [TestItem])
const TestCharacter2: Character = new Character("2", "2", "1", "Spieler", "Magier", TestSpecies, TestGender, TestMaxStats, TestStartStats, TestRoom, [TestItem])
const TestDungeon: Dungeon = new Dungeon("1", "TestDungeon1", "Test", "1", "1", 2, 1, [TestSpecies], [TestClass], [TestGender], [TestCharacter, TestCharacter2], [TestRoom], ["abc"], [TestAction])

beforeAll(() => {
    
})

describe("Action Handler", () => {
    const actionHandler: ActionHandler = new ActionHandler(TestDungeon)
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

    test('ActionHandler should call performAction on MessageAction with the correct parameters when it receives a "sag" action message', () => {
        actionHandler.processAction("1", "sag Hallo")
        expect(messageAction.performAction).toHaveBeenCalledWith("1", ["Hallo"])
    })
    test('ActionHandler should call performAction on PrivateMessageAction with the correct parameters when it receives a "fluester" action message', () => {
        actionHandler.processAction("1", "fluester Spieler Hallo")
        expect(privateMessageAction.performAction).toHaveBeenCalledWith("1", ["Spieler", "Hallo"])
    })
    test('ActionHandler should call performAction on DiscardAction with the correct parameters when it receives a "ablegen" action message', () => {
        actionHandler.processAction("1", "ablegen Apfel")
        expect(discardAction.performAction).toHaveBeenCalledWith("1", ["Apfel"])
    })
    test('ActionHandler should call performAction on InspectAction with the correct parameters when it receives a "untersuche" action message', () => {
        actionHandler.processAction("1", "untersuche Apfel")
        expect(inspectAction.performAction).toHaveBeenCalledWith("1", ["Apfel"])
    })
    test('ActionHandler should call performAction on LookAction with the correct parameters when it receives a "umschauen" action message', () => {
        actionHandler.processAction("1", "umschauen")
        expect(lookAction.performAction).toHaveBeenCalledWith("1", [])
    })
    test('ActionHandler should call performAction on MoveAction with the correct parameters when it receives a "gehe" action message', () => {
        actionHandler.processAction("1", "gehe Norden")
        expect(moveAction.performAction).toHaveBeenCalledWith("1", ["Norden"])
    })
    test('ActionHandler should call performAction on PickupAction with the correct parameters when it receives a "aufheben" action message', () => {
        actionHandler.processAction("1", "aufheben Apfel")
        expect(pickupAction.performAction).toHaveBeenCalledWith("1", ["Apfel"])
    })
    test('ActionHandler should call performAction on DungeonAction with the correct parameters when it receives a non standard action message', () => {
        actionHandler.processAction("1", "essen Apfel")
        expect(dungeonAction.performAction).toHaveBeenCalledWith("1", ["Apfel"])
    })
    test('ActionHandler should call performAction on UnspecifiedAction with the correct parameters when it receives a non specified action message', () => {
        actionHandler.processAction("1", "angriff Monster")
        expect(unspecifiedAction.performAction).toHaveBeenCalledWith("1", ["Monster"])
    })
})

describe("Actions", () => {
    const messageAction: MessageAction = new MessageAction(TestDungeon);
   
    amqpAdapter.sendWithRouting = jest.fn()
    amqpAdapter.sendToClient = jest.fn()
    
    test("MessageAction should call sendWithRouting on the AmqpAdapter with the correct routingKey and payload", () => {
        messageAction.performAction(TestDungeon.characters[0].id, ["Hallo", "zusammen!"])
        expect(amqpAdapter.sendWithRouting).toHaveBeenCalledWith("1.room.Raum-1", {action: "message", data: {message: "[Raum-1] Jeff sagt Hallo zusammen!"}})
    })

    test("PrivateMessageAction should call sendToClient on the AmqpAdapter to both users with the correct payload", () => {
        messageAction.performAction(TestDungeon.characters[0].id, ["Spieler", "Hallo"])
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith("1.character.1", {action: "message", data: {message: "[privat] Jeff -> Spieler: Hallo"}})
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith("1.character.2", {action: "message", data: {message: "[privat] Jeff -> Spieler: Hallo"}})
    })

    test("PrivateMessageAction should call sendToClient on the AmqpAdapter to the initial sender saying the recipient does not exist when trying to send a message to a character that is not in the same room", () => {
        messageAction.performAction(TestDungeon.characters[0].id, ["Bob", "Hallo"])
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith("1.character.1", {action: "message", data: {message: "Bob ist nicht in diesem Raum!"}})
    })
})
        

