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

    //dungeonmaster
    addDamage: "adddmg",
    addHp: "addhp",
    addMana: "addhp",
    removeMana: "remmana",
    removeHp: "remhp",
    removeDamage: "remdmg"
}

export const actionMessages = {
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
    dmWhisper: "[privat] Dungeon Master -> %s: %s",
    whisperToDm: "[privat] %s -> Dungeon Master: %s",
    discard: "Du hast folgendes Item abgelegt: %s",
    pickup: "Du hast folgendes Item aufgehoben: %s"
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
    addHp: "Du hast %s Leben erhalten",
    addMana: "Du hast %s Mana erhalten",
    removeMana: "Du hast %s Mana verloren",
    removeDmg: "Du hast %s Schaden verloren",
    removeHp: "Du hast %s Leben verloren",
}

export const extras = {
    dungeonMasterId: '0'
}

export interface MiniMapData {
    rooms: {[key:string]: {
        xCoordinate: Room['xCoordinate'],
        yCoordinate: Room['yCoordinate'],
        connections: Room['connections'],
        explored: boolean
    }};
    startRoom: string;
}

export function parseResponseString(str: string, ...args: string[]): string {
    let i = 0;
    return str.replace(/%s/g, () => args[i++]);
}

