/**
 * File that holds all necessary string resources.
 */

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
    invalid: "invalid"
}

export const actionMessages = {
    inspect: "Du untersuchst",
    inventory: "Du hast folgende Items im Inventar:",
    lookEmpty: " Keine",
    lookRoom: "Du befindest dich im Raum",
    lookAround: "Du schaust dich um.",
    lookItems: "Es liegen folgende Items in dem Raum:",
    lookNpcs: "Folgende NPCs sind in diesem Raum:",
    lookNorth: "Im Norden befindet sich folgender Raum:",
    lookEast: "Im Osten befindet sich folgender Raum:",
    lookSouth: "Im Sueden befindet sich folgender Raum:",
    lookWest: "Im Westen befindet sich folgender Raum:",
    lookActions: "Du kannst in diesem Raum folgende Aktionen ausfuehren:",
    lookPlayers: "In diesem Raum befinden sich folgende Spieler:", // noch einbauen
    say: "sagt",
    move1: "ist",
    move2: "beigetreten!",
    moveRoomClosed: "In diese Richtung ist der Raum geschlossen!",
    movePathNotAvailable: "In diese Richtung geht es nicht weiter!",
    whisperCharacterNotInSameRoom: "ist nicht in diesem Raum!",
    dmWhisper: "Dungeon Master"
}

export const errorMessages = {
    itemNotOwned: "Du besitzt dieses Item nicht!",
    directionDoesNotExist: "Diese Richtung existiert nicht!",
    characterDoesNotExist1: "Der Charakter",
    characterDoesNotExist2: "existiert nicht in diesem Dungeon!",
    actionDoesNotExist: "Diese Aktion existiert nicht!",
    lookError: " Fehler!"
}