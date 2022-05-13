/**
 * File that holds all necessary string resources.
 */

import { Room } from "../../../data/interfaces/room";

export const triggers = {
    discard: "ablegen",
    inspect: "untersuche",
    inventory: "inv",
    look: "umschauen",
    message: "sag",
    broadcast: "broadcast",
    move: "gehe",
    pickup: "aufheben",
    whisper: "fluester",
    messageMaster: "fluesterdm",
    unspecified: "dm",
    invalid: "invalid",
    help: "hilfe",
    showActions: "aktionen",

    //dungeonmaster
    addDamage: "adddmg",
    addHp: "addhp",
    addMana: "addmana",
    removeMana: "remmana",
    removeHp: "remhp",
    removeDamage: "remdmg",
    changeRoom: "verschiebe",
    removeItem: "remitem",
    removeRoomItem: "remroomitem",
    addRoomItem: "addroomitem",
    addItem: "additem",
    toggleConnection: "toggle",
    kickPlayer: "kick",
    banPlayer: "ban",
    showDmActions: "aktionen"
}

export const actionMessages = {
    die: "Du bist gestorben!",
    dieDungeonMaster: "%s ist in %s gestorben!",
    inspect: "Du untersuchst %s: %s",
    inventory: "Du hast folgende Items im Inventar:",
    lookEmpty: " Keine",
    lookRoom: "Du befindest dich im Raum %s: %s - Du schaust dich um. ",
    lookItems: "\nEs liegen folgende Items in dem Raum:",
    lookNpcs: "\nFolgende NPCs sind in diesem Raum:",
    lookNorth: "\nIm Norden befindet sich folgender Raum:",
    lookEast: "\nIm Osten befindet sich folgender Raum:",
    lookSouth: "\nIm Sueden befindet sich folgender Raum:",
    lookWest: "\nIm Westen befindet sich folgender Raum:",
    lookActions: "\nDu kannst in diesem Raum folgende Aktionen ausfuehren:",
    lookPlayers: "\nIn diesem Raum befinden sich folgende Spieler:",
    say: "[%s] %s sagt %s",
    whisper: "[privat] %s -> %s: %s",
    moveEnter: "%s ist %s beigetreten!",
    moveLeave: "%s hat %s verlassen!",
    moveRoomClosed: "In diese Richtung ist der Raum geschlossen!",
    movePathNotAvailable: "In diese Richtung geht es nicht weiter!",
    whisperCharacterNotInSameRoom: "%s ist nicht in diesem Raum!",
    whisperToDm: "[privat] %s -> Dungeon Master: %s",
    discard: "Du hast folgendes Item abgelegt: %s",
    discardDungeonMaster: "%s hat %s in %s abgelegt!",
    pickup: "Du hast folgendes Item aufgehoben: %s",
    pickupDungeonMaster: "%s hat %s aus %s aufgehoben!",
    dungeonActionItemsMissing: "Dir fehlen folgende Items fuer die Aktion:",
    helpMessage: "Willkommen in %s!\nGebe '%s' ein, um eine Liste aller moeglichen Aktionen in einem Raum zu erhalten.\nGebe '%s' ein, um dich im Raum umzuschauen.\nWenn du nicht weiter kommst, gib '%s' ein.",
    helpMessageDm: "Willkommen in %s!\nGebe '%s' ein, um eine Liste aller moeglichen Aktionen zu erhalten.",
    showActionsBeginning: "Du kannst in diesem Raum folgende Aktionen ausfuehren: ",
    showActionsEnding: "\n\tGebe gegebenenfalls geeignete Argumente fuer <> ein.",
    unspecifiedActionPlayer: "Du hast folgende Aktion beim Dungeon Master angefragt: %s",
    unspecifiedActionDungeonMaster: "%s hat folgende Aktion in %s angefragt: %s",
    playerKicked: "%s wurde aus dem Dungeon gekickt!",
    playerBanned: "%s wurde vom Dungeon gebannt!",
    broadcast: "Dungeon Master sagt: %s"
}

export const errorMessages = {
    itemNotOwned: "Du besitzt dieses Item nicht! Gib '%s' ein, um deine Items zu sehen.",
    itemNotInRoom: "Dieses Item existiert nicht in diesem Raum! Gib '%s' ein, um die Items im Raum zu sehen.",
    itemDoesntexist: "Dieses Item existiert nicht!",
    roomDoesNotExist: "Dieser Raum existiert nicht!",
    directionDoesNotExist: "Diese Richtung existiert nicht!",
    moveAvailableDirections: " Folgende Richtungen sind moeglich: Norden, Osten, Sueden, Westen.",
    characterDoesNotExist: "Der Charakter %s existiert nicht in diesem Dungeon! Gib '%s' ein, um eine Liste der Spieler in deinem Raum zu sehen.",
    actionDoesNotExist: "Diese Aktion ist nicht möglich! Gib '%s' ein um eine Liste der moeglichen Aktionen zu sehen.",
    lookError: " Fehler!",
    charakterHasntItem: "%s besitzt dieses Item nicht!",
    noMessage: "Bitte geb eine Nachricht zum senden ein!",
    cannotBanOwnCharacter: "Du kannst nicht deine eigenen Charaktere bannen!",
    cannotBanDungeonCreator: "Du kannst nicht den Ersteller des Dungeons bannen!"
}

export const helpMessagesForDM = {
    characterDoesNotExist: "Der Charakter %s existiert nicht in diesem Dungeon! Schaue links in der Liste welche Charaktere sich im Dungeon befinden.",
    itemDoesNotExist: "Dieses Item existiert nicht! Folgende Items existieren in diesem Dungeon: %s",
    roomDoesNotExist: "Dieser Raum existiert nicht! Folgende Raeume existieren in diesem Dungeon: %s",
    valueNotANumber: "Bitte gib als Wert eine Zahl ein!",
    itemNotInRoom: "Dieses Item existiert nicht in diesem Raum!"
}

export const dungeonMasterSendMessages = {
    addDmg: "Du hast %s Schaden erhalten",
    damageRecieved: "%s hat %s Schaden erhalten",
    addHp: "Du hast %s Leben erhalten",
    hpRecieved: "%s hat %s Leben erhalten",
    addMana: "Du hast %s Mana erhalten",
    manaRecieved: "%s hat %s Mana erhalten",
    removeMana: "Du hast %s Mana verloren",
    ManaRemoved: "%s hat %s Mana verloren",
    removeDmg: "Du hast %s Schaden verloren",
    dmgRemoved: "%s hat %s Schaden verloren",
    removeHp: "Du hast %s Leben verloren",
    hpRemoved: "%s hat %s Leben verloren",
    dmWhisper: "[privat] Dungeon Master -> %s: %s",
    dmRoomMove: "%s wurde in Raum %s verschoben",
    roomMove: "Du wurdest vom Dungeon Master in den Raum %s verschoben",
    alreadyRoom: "Der Spieler ist bereits im gewünschten Raum",
    addItem: "Der Dungeon Master hat das Item %s deinem Inventar hinzugefuegt",
    itemAdded: "Das Item %s wurde in %s's Inventar hinzugefuegt",
    removeItem: "Der Dungeon Master hat das Item %s aus deinem Inventar entfernt",
    itemRemoved: "Das Item %s wurde aus %s's Inventar entfernt",
    itemRoomAdded: "In %s wurde das Item %s hinzugefuegt",
    itemRoomRemoved: "Aus %s wurde das Item %s entfernt",
    toggleConnection: "Der Durchgang zwischen %s und %s wurde %s!",
    connectionOpen: "geoeffnet",
    connectionClosed: "geschlossen",
    showDmActionsBeginning: "Du kannst in diesem Raum folgende Aktionen ausfuehren: ",
    showDmActionsEnding: "\nGebe gegebenenfalls geeignete Argumente fuer <> ein. Möchtest du weitere Informationen über einen Spieler haben, klicke in der Spielerliste auf den Namen des gewünschten Spielers."
}

export const extras = {
    dungeonMasterId: 'dungeonmaster'
}

export const actionDescriptions = {
    move: parseResponseString("\n\t'%s <norden|osten|sueden|westen>' - Gehe in einen anschliessenden Raum, falls eine Verbindung besteht; ", triggers.move),
    look: parseResponseString("\n\t'%s' - Erhalte Informationen ueber den Raum in dem du dich gerade befindest; ", triggers.look),
    inv: parseResponseString("\n\t'%s' - Zeigt die Items in deinem Inventar an; ", triggers.inventory),
    pickup: parseResponseString("\n\t'%s <Itemname>' - Hebe ein Item aus dem Raum auf; ", triggers.pickup),
    discard: parseResponseString("\n\t'%s <Itemname>' - Lege ein Item aus deinem Inventar in den Raum ab; ", triggers.discard),
    inspect: parseResponseString("\n\t'%s <Itemname>' - Erhalte eine Beschreibung ueber ein Item in deinem Inventar; ", triggers.inspect),
    unspecified: parseResponseString("\n\t'%s <aktion>' - Frage eine Aktion beim Dungeon Master an; ", triggers.unspecified),
    message: parseResponseString("\n\t'%s <Nachricht>' - Sende eine Nachricht in den Raum; ", triggers.message),
    whisper: parseResponseString("\n\t'%s <Spieler> <Nachricht>' - Sende eine Nachricht an einen Spieler in dem Raum; ", triggers.whisper),
    messageMaster: parseResponseString("\n\t'%s <Nachricht>' - Sende eine private Nachricht an den Dungeon Master; ", triggers.messageMaster),
    help: parseResponseString("\n\t'%s' - Wenn du nicht mehr weiterkommst; ", triggers.help),
    showActions: parseResponseString("\n\t'%s' - Erhalte eine Beschreibung alle ausfuehrbaren Aktionen; ", triggers.showActions)
}

export const dmActionDescriptions = {
    addDamage: parseResponseString("\n\t'%s <Spielername>' - Erhöhe den Schaden eines Spielers; ", triggers.addDamage),
    addHp: parseResponseString("\n\t'%s <Spielername>' - Erhöhe das Leben eines Spielers; ", triggers.addHp),
    addMana: parseResponseString("\n\t'%s <Spielername>' - Erhöhe das Mana eines Spielers; ", triggers.addMana),
    removeMana: parseResponseString("\n\t'%s <Spielername>' - Verringere das Mana eines Spielers; ", triggers.removeMana),
    removeHp: parseResponseString("\n\t'%s <Spielername>' - Verringere das Leben eines Spielers; ", triggers.removeHp),
    removeDamage: parseResponseString("\n\t'%s <Spielername>' - Verringere den Schaden eines Spielers; ", triggers.removeDamage),
    changeRoom: parseResponseString("\n\t'%s <Spielername>' - Ändere die Position eines Spielers; ", triggers.changeRoom),
    removeItem: parseResponseString("\n\t'%s <Spielername> <Itemname>' - Entferne ein Item von einem Spieler; ", triggers.removeItem),
    removeRoomItem: parseResponseString("\n\t'%s <Spieler> <Raumname>' - Entferne ein Item aus einem Raum; ", triggers.removeRoomItem),
    addItem: parseResponseString("\n\t'%s <Spielername> <Itemname>' - Gebe einem Spieler ein Item; ", triggers.addItem),
    addRoomItem: parseResponseString("\n\t'%s <Raumname> <Itemname>' - Lege ein Item in den Raum; ", triggers.addRoomItem),
    kickPlayer: parseResponseString("\n\t'%s <Spielername> - Schmeiße einen Spieler aus der Lobby; ", triggers.kickPlayer),
    banPlayer: parseResponseString("\n\t'%s <Spielername> - Banne einen Spieler permanent aus deinem Dungeon; ", triggers.banPlayer),
    showDmActions: parseResponseString("\n\t'%s - Erhalte eine Beschreibung alle ausführbaren Aktionen; ", triggers.showDmActions),
    toggleConnection: parseResponseString("\nÜber die Minimap können außerdem die Verbindungen getoggled werden. Klick dafür auf die Verbindung zwischen den Räumen."),
}


export const eventCases: { [event: string]: number } = {
    "addhp": 1,
    "removehp": 2,
    "addmana": 3,
    "removemana": 4,
    "adddmg": 5,
    "removedmg": 6,
    "additem": 7,
    "removeItem": 8
}

export const characterStats = {
    hp: "hp",
    mana: "mana",
    dmg: "dmg"
}

export const operations = {
    add: "add",
    remove: "remove"
}

export interface MiniMapData {
    rooms: {[key:string]: {
        xCoordinate: Room['xCoordinate'],
        yCoordinate: Room['yCoordinate'],
        connections: Room['connections'],
        explored: boolean,
        name?:string
    }};
    startRoom: string;
}

export function parseResponseString(str: string, ...args: string[]): string {
    let i = 0;
    return str.replace(/%s/g, () => args[i++]);
}
