/**
 * File that holds all necessary string resources.
 */

import { parse } from "path";
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
    toggleConnection: "toggle"
}

export const actionMessages = {
    die: "Du bist gestorben!",
    dieDungeonMaster: "%s ist in %s gestorben!",
    inspect: "Du untersuchst %s: %s",
    inventory: "Du hast folgende Items im Inventar:",
    lookEmpty: " Keine",
    lookRoom: "Du befindest dich im Raum %s: %s. Du schaust dich um. ",
    lookItems: "Es liegen folgende Items in dem Raum:",
    lookNpcs: "Folgende NPCs sind in diesem Raum:",
    lookNorth: "Im Norden befindet sich folgender Raum:",
    lookEast: "Im Osten befindet sich folgender Raum:",
    lookSouth: "Im Sueden befindet sich folgender Raum:",
    lookWest: "Im Westen befindet sich folgender Raum:",
    lookActions: "Du kannst in diesem Raum folgende Aktionen ausfuehren:",
    lookPlayers: "In diesem Raum befinden sich folgende Spieler:",
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
    helpMessage: "Willkommen in %s! Gebe '%s' ein, um eine Liste aller moeglichen Aktionen in einem Raum zu erhalten. Gebe '%s' ein, um dich im Raum umzuschauen. Wenn du nicht weiter kommst, gib '%s' ein.",
    showActionsBeginning: "Du kannst in diesem Raum folgende Aktionen ausfuehren: ",
    showActionsEnding: "Gebe gegebenenfalls geeignete Argumente fuer <> ein.",
    unspecifiedActionPlayer: "Du hast folgende Aktion beim Dungeon Master angefragt: %s",
    unspecifiedActionDungeonMaster: "%s hat folgende Aktion in %s angefragt: %s"
}

export const errorMessages = {
    itemNotOwned: "Du besitzt dieses Item nicht!",
    itemNotInRoom: "Dieses Item existiert nicht in diesem Raum!",
    directionDoesNotExist: "Diese Richtung existiert nicht!",
    characterDoesNotExist: "Der Charakter %s existiert nicht in diesem Dungeon!",
    actionDoesNotExist: "Diese Aktion ist nicht möglich!",
    lookError: " Fehler!",
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
    toggleConnection: "Der Durchgang zwischen %s und %s wurde %s!",
    connectionOpen: "geoeffnet",
    connectionClosed: "geschlossen"
}

export const extras = {
    dungeonMasterId: 'dungeonmaster'
}

export const actionDescriptions = {
    move: parseResponseString("'%s <norden|osten|sueden|westen>' - Gehe in einen anschliessenden Raum, falls eine Verbindung besteht; ", triggers.move),
    look: parseResponseString("'%s' - Erhalte Informationen ueber den Raum in dem du dich gerade befindest; ", triggers.look),
    inv: parseResponseString("'%s' - Zeigt die Items in deinem Inventar an; ", triggers.inventory),
    pickup: parseResponseString("'%s <Itemname>' - Hebe ein Item aus dem Raum auf; ", triggers.pickup),
    discard: parseResponseString("'%s <Itemname>' - Lege ein Item aus deinem Inventar in den Raum ab; ", triggers.discard),
    inspect: parseResponseString("'%s <Itemname>' - Erhalte eine Beschreibung ueber ein Item in deinem Inventar; ", triggers.inspect),
    unspecified: parseResponseString("'%s <aktion>' - Frage eine Aktion beim Dungeon Master an; ", triggers.unspecified),
    message: parseResponseString("'%s <Nachricht>' - Sende eine Nachricht in den Raum; ", triggers.message),
    whisper: parseResponseString("'%s <Spieler> <Nachricht>' - Sende eine Nachricht an einen Spieler in dem Raum; ", triggers.whisper),
    messageMaster: parseResponseString("'%s <Nachricht>' - Sende eine private Nachricht an den Dungeon Master; ", triggers.messageMaster),
    help: parseResponseString("'%s' - Wenn du nicht mehr weiterkommst; ", triggers.help),
    showActions: parseResponseString("'%s' - Erhalte eine Beschreibung alle ausfuehrbaren Aktionen; ", triggers.showActions)
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

