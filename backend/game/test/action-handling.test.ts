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
const TestRoom: Room = new Room("1", "Raum-1", "Der Raum in dem alles begann", [TestNpc], [TestItem], TestConnections, [TestAction], 2, 2)
const TestRoomNorth: Room = new Room("2", "Raum-N", "Der Raum im Norden", [TestNpc], [TestItem], new ConnectionInfo("closed", "active"), [TestAction], 2, 3)
const TestRoomEast: Room = new Room("3", "Raum-O", "Der Raum im Osten", [TestNpc], [TestItem], new ConnectionInfo("closed", "closed"), [TestAction], 3, 2)
const TestRoomSouth: Room = new Room("4", "Raum-S", "Der Raum im Sueden", [TestNpc], [TestItem], new ConnectionInfo("closed", "closed"), [TestAction], 2, 1)
const TestRoomWest: Room = new Room("5", "Raum-W", "Der Raum im Westen", [TestNpc], [TestItem], new ConnectionInfo("active", "closed"), [TestAction], 1, 2)
const TestCharacter: Character = new Character("1", "1", "1", "Jeff", "Magier", TestSpecies, TestGender, TestMaxStats, TestStartStats, TestRoom, [TestItem])
const TestCharacterSameRoom: Character = new Character("2", "2", "1", "Spieler", "Magier", TestSpecies, TestGender, TestMaxStats, TestStartStats, TestRoom, [TestItem])
const TestCharacterNotSameRoom: Character = new Character("3", "3", "1", "Bob", "Magier", TestSpecies, TestGender, TestMaxStats, TestStartStats, TestRoomNorth, [TestItem])
const TestDungeon: Dungeon = new Dungeon("1", "TestDungeon1", "Test", "1", "1", 2, 1, [TestSpecies], [TestClass], [TestGender], [TestCharacter, TestCharacterSameRoom, TestCharacterNotSameRoom], [TestRoom,TestRoomNorth, TestRoomEast, TestRoomSouth, TestRoomWest], ["abc"], [TestAction])

beforeAll(() => {
    
})

describe("ActionHandler", () => {
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
    amqpAdapter.sendWithRouting = jest.fn()
    amqpAdapter.sendToClient = jest.fn()
    amqpAdapter.bindClientQueue = jest.fn()
    amqpAdapter.unbindClientQueue = jest.fn()
    
    test("MessageAction should call sendWithRouting on the AmqpAdapter with the correct routingKey and payload", () => {
        messageAction.performAction(TestDungeon.characters[0].id, ["Hallo", "zusammen!"])
        expect(amqpAdapter.sendWithRouting).toHaveBeenCalledWith("1.room.1", {action: "message", data: {message: "[Raum-1] Jeff sagt Hallo zusammen!"}})
    })

    test("PrivateMessageAction should call sendToClient on the AmqpAdapter to both users with the correct payload", () => {
        privateMessageAction.performAction(TestDungeon.characters[0].id, ["Spieler", "Hallo"])
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith("1.character.1", {action: "message", data: {message: "[privat] Jeff -> Spieler: Hallo"}})
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith("1.character.2", {action: "message", data: {message: "[privat] Jeff -> Spieler: Hallo"}})
    })

    test("PrivateMessageAction should call sendToClient on the AmqpAdapter to the initial sender saying the recipient is not in the same room when trying to send a message to a character that is not in the same room", () => {
        privateMessageAction.performAction(TestDungeon.characters[0].id, ["Bob", "Hallo"])
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith("1.character.1", {action: "message", data: {message: "Bob ist nicht in diesem Raum!"}})
    })

    test("PrivateMessageAction should call sendToClient on the AmqpAdapter to the initial sender saying the recipient does not exist in the dungeon when trying to send a message to a character that does not exist", () => {
        privateMessageAction.performAction(TestDungeon.characters[0].id, ["Held", "Hallo"])
        expect(amqpAdapter.sendToClient).toHaveBeenCalledWith("1.character.1", {action: "message", data: {message: "Der Charakter Held existiert nicht in diesem Dungeon!"}})
    })

    test("MoveAction should modify the position, call the functions to bind the client queues and call sendWithRouting on the AmqpAdapter when user moves to another room", () => {
        moveAction.performAction(TestDungeon.characters[0].id, ["Norden"])
        expect(TestDungeon.characters[0].position).toBe(TestRoomNorth)
        expect(amqpAdapter.unbindClientQueue).toHaveBeenCalledWith("1", "1")
        expect(amqpAdapter.bindClientQueue).toHaveBeenCalledWith("1", "2")
        expect(amqpAdapter.sendWithRouting).toHaveBeenCalledWith("1.room.2", {action: "message", data: {message: "Jeff ist Raum-N beigetreten!"}})
    })

    test("MoveAction should modify the position to the room in the East when user moves east", () => {
        moveAction.performAction(TestDungeon.characters[0].id, ["Osten"])
        expect(TestDungeon.characters[0].position).toBe(TestRoomEast)
    })

    test("MoveAction should modify the position to the room in the South when user moves south", () => {
        moveAction.performAction(TestDungeon.characters[0].id, ["Sueden"])
        expect(TestDungeon.characters[0].position).toBe(TestRoomSouth)
    })

    test("MoveAction should modify the position to the room in the West when user moves west", () => {
        moveAction.performAction(TestDungeon.characters[0].id, ["Osten"])
        expect(TestDungeon.characters[0].position).toBe(TestRoomWest)
    })

    test("MoveAction should call sendToClient on AmqpAdapter to the initial sender saying the room does not exist", () => {
        moveAction.performAction(TestDungeon.characters[0].id, ["Osten"])
    })

    test("MoveAction should call sendToClient on AmqpAdapter to the initial sender saying the room is closed", () => {
        moveAction.performAction(TestDungeon.characters[0].id, ["Osten"])
    })
})

        

