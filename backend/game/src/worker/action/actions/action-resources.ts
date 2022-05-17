/**
 * File that holds all necessary string resources.
 */

import { Room } from "../../../data/interfaces/room";
import format from "./format";

export const triggers = {
    discard: `ablegen`,
    inspect: `untersuche`,
    unbanPlayer: `pardon`,
    inventory: `inv`,
    look: `umschauen`,
    message: `sag`,
    broadcast: `broadcast`,
    move: `gehe`,
    pickup: `aufheben`,
    whisper: `fluester`,
    messageMaster: `fluesterdm`,
    unspecified: `dm`,
    invalid: `invalid`,
    help: `hilfe`,
    showActions: `aktionen`,

    //dungeonmaster
    addDamage: `adddmg`,
    addHp: `addhp`,
    addMana: `addmana`,
    removeMana: `remmana`,
    removeHp: `remhp`,
    removeDamage: `remdmg`,
    changeRoom: `verschiebe`,
    removeItem: `remitem`,
    removeRoomItem: `remroomitem`,
    addRoomItem: `addroomitem`,
    addItem: `additem`,
    toggleConnection: `toggle`,
    dmgiveup: `dmgiveup`,
    kickPlayer: `kick`,
    banPlayer: `ban`,
    showDmActions: `aktionen`
}

export const actionMessages = {
    playerUnbanned: `${format.bold}${format.color.green}%s wurde vom Dungeon entbannt.${format.reset}`,
    die: `${format.bold}${format.rgb(117, 23, 23)}Du bist gestorben!${format.reset}`,
    dieDungeonMaster: `${format.bold}${format.rgb(117, 23, 23)}%s ist in %s gestorben!${format.reset}`,
    inspect: `Du untersuchst %s: %s`,
    inventory: `Du hast folgende Items im Inventar:`,
    lookEmpty: ` Keine`,
    lookRoom: `Du befindest dich im Raum %s: %s - Du schaust dich um. `,
    lookItems: `\n${format.bold}Es liegen folgende Items in dem Raum${format.reset}:`,
    lookNpcs: `\n${format.bold}Folgende NPCs sind in diesem Raum${format.reset}:`,
    lookNorth: `\n${format.bold}Im Norden befindet sich folgender Raum${format.reset}:`,
    lookEast: `\n${format.bold}Im Osten befindet sich folgender Raum${format.reset}:`,
    lookSouth: `\n${format.bold}Im Sueden befindet sich folgender Raum${format.reset}:`,
    lookWest: `\n${format.bold}Im Westen befindet sich folgender Raum${format.reset}:`,
    lookActions: `\n${format.bold}Du kannst in diesem Raum folgende Aktionen ausfuehren${format.reset}:`,
    lookPlayers: `\n${format.bold}In diesem Raum befinden sich folgende Spieler${format.reset}:`,
    say: `${format.bold}[%s]${format.reset} %s: %s`,
    whisper: `${format.color.red}[privat] ${format.reset}${format.bold} %s -> %s${format.reset}: %s`,
    moveEnter: `%s ist %s beigetreten!`,
    moveLeave: `%s hat %s verlassen!`,
    moveRoomClosed: `${format.color.red}In diese Richtung ist der Raum geschlossen!${format.reset}`,
    movePathNotAvailable: `${format.color.red}In diese Richtung geht es nicht weiter!${format.reset}`,
    whisperCharacterNotInSameRoom: `${format.color.red}%s ist nicht in diesem Raum!${format.reset}`,
    whisperToDm: `${format.color.red}[privat] ${format.reset}${format.bold} %s -> Dungeon Master: %s`,
    discard: `Du hast folgendes Item abgelegt: %s`,
    discardDungeonMaster: `%s hat %s in %s abgelegt!`,
    pickup: `Du hast folgendes Item aufgehoben: %s`,
    pickupDungeonMaster: `%s hat %s aus %s aufgehoben!`,
    dungeonActionItemsMissing: `${format.color.red}Dir fehlen folgende Items fuer die Aktion:${format.reset}`,
    helpMessage: `${format.bold}${format.rgb(37,147,95)}Willkommen in %s!${format.reset}\nGebe ${format.bold}%s${format.reset} ein, um eine Liste aller moeglichen Aktionen in einem Raum zu erhalten.\nGebe ${format.bold}%s${format.reset} ein, um dich im Raum umzuschauen.\nWenn du nicht weiter kommst, gib ${format.bold}%s${format.reset} ein.`,
    helpMessageDm: `${format.bold}${format.rgb(37,147,95)}Willkommen in %s!${format.reset}\nGebe ${format.bold}%s${format.reset} ein, um eine Liste aller moeglichen Aktionen zu erhalten.`,
    showActionsBeginning: `Du kannst in diesem Raum folgende Aktionen ausfuehren: `,
    showActionsEnding: `\n\tGebe gegebenenfalls geeignete Argumente fuer <> ein.`,
    unspecifiedActionPlayer: `Du hast folgende Aktion beim Dungeon Master angefragt: %s`,
    unspecifiedActionDungeonMaster: `${format.bold}%s hat folgende Aktion in %s angefragt${format.reset}: %s`,
    playerKicked: `${format.bold}${format.rgb(196,10,50)}%s wurde aus dem Dungeon gekickt!${format.reset}`,
    playerBanned: `${format.bold}${format.rgb(196,10,50)}%s wurde vom Dungeon gebannt!${format.reset}`,
    broadcast: `${format.color.red}${format.bold}Dungeon Master sagt: %s ${format.reset}`,
}

export const errorMessages = {
    playerNotBanned: `${format.color.red}%s ist nicht gebannt!${format.reset}`,
    itemNotOwned: `${format.color.red}Du besitzt dieses Item nicht! Gib ${format.bold}%s${format.reset} ein, um deine Items zu sehen.${format.reset}`,
    itemNotInRoom: `${format.color.red}Dieses Item existiert nicht in diesem Raum! Gib ${format.bold}%s${format.reset} ein, um die Items im Raum zu sehen.${format.reset}`,
    itemDoesntexist: `${format.color.red}Dieses Item existiert nicht!${format.reset}`,
    roomDoesNotExist: `${format.color.red}Dieser Raum existiert nicht!${format.reset}`,
    directionDoesNotExist: `${format.color.red}Diese Richtung existiert nicht!${format.reset}`,
    moveAvailableDirections: `${format.color.red} Folgende Richtungen sind moeglich: Norden, Osten, Sueden, Westen.${format.reset}`,
    characterDoesNotExist: `Der Charakter %s existiert nicht in diesem Dungeon! Gib ${format.bold}%s${format.reset} ein, um eine Liste der Spieler in deinem Raum zu sehen.`,
    actionDoesNotExist: `${format.color.red}Diese Aktion ist nicht möglich! Gib ${format.bold}%s${format.reset}${format.color.red} ein um eine Liste der moeglichen Aktionen zu sehen.${format.reset}`,
    lookError: `${format.color.red} Fehler!${format.reset}`,
    charakterHasntItem: `${format.color.red}%s besitzt dieses Item nicht!${format.reset}`,
    noMessage: `${format.color.red}Bitte geb eine Nachricht zum senden ein!${format.reset}`,
    cannotBanOwnCharacter: `${format.color.red}Du kannst nicht deine eigenen Charaktere bannen!${format.reset}`,
    cannotBanDungeonCreator: `${format.color.red}Du kannst nicht den Ersteller des Dungeons bannen${format.reset}`
}

export const helpMessagesForDM = {
    characterDoesNotExist: `Der Charakter %s existiert nicht in diesem Dungeon! Schaue links in der Liste welche Charaktere sich im Dungeon befinden.`,
    itemDoesNotExist: `Dieses Item existiert nicht! Folgende Items existieren in diesem Dungeon: %s`,
    roomDoesNotExist: `Dieser Raum existiert nicht! Folgende Raeume existieren in diesem Dungeon: %s`,
    valueNotANumber: `Bitte gib als Wert eine Zahl ein!`,
    itemNotInRoom: `Dieses Item existiert nicht in diesem Raum!`
}

export const dungeonMasterSendMessages = {
    addDmg: `Du hast ${format.bold}${format.rgb(109,109,109)}%s Schaden${format.reset} erhalten`,
    damageRecieved: `%s hat ${format.bold}${format.rgb(109,109,109)}%s Schaden${format.reset} erhalten`,
    addHp: `Du hast ${format.bold}${format.rgb(189, 68, 68)}%s Leben${format.reset} erhalten`,
    hpRecieved: `%s hat ${format.bold}${format.rgb(189, 68, 68)}%s Leben${format.reset} erhalten`,
    addMana: `Du hast ${format.bold}${format.rgb(97, 158, 201)}%s Mana${format.reset} erhalten`,
    manaRecieved: `%s hat ${format.bold}${format.rgb(97, 158, 201)}%s Mana${format.reset} erhalten`,
    removeMana: `Du hast ${format.bold}${format.rgb(97, 158, 201)}%s Mana${format.reset} verloren`,
    ManaRemoved: `%s hat ${format.bold}${format.rgb(97, 158, 201)}%s Mana${format.reset} verloren`,
    removeDmg: `Du hast ${format.bold}${format.rgb(109,109,109)}%s Schaden${format.reset} verloren`,
    dmgRemoved: `%s hat ${format.bold}${format.rgb(109,109,109)}%s Schaden${format.reset} verloren`,
    removeHp: `Du hast ${format.bold}${format.rgb(189, 68, 68)}%s Leben${format.reset} verloren`,
    hpRemoved: `%s hat ${format.bold}${format.rgb(189, 68, 68)}%s Leben${format.reset} verloren`,
    dmWhisper: `${format.color.red}[privat] ${format.reset}${format.bold} Dungeon Master -> %s: %s`,
    dmRoomMove: `%s wurde in Raum %s verschoben`,
    roomMove: `Du wurdest vom Dungeon Master in den Raum %s verschoben`,
    alreadyRoom: `Der Spieler ist bereits im gewünschten Raum`,
    addItem: `Der Dungeon Master hat das Item %s deinem Inventar ${format.color.green}hinzugefuegt${format.reset}`,
    itemAdded: `Das Item %s wurde in %s's Inventar ${format.color.green}hinzugefuegt${format.reset}`,
    removeItem: `Der Dungeon Master hat das Item %s aus deinem Inventar ${format.color.red}entfernt${format.reset}`,
    itemRemoved: `Das Item %s wurde aus %s's Inventar ${format.color.red}entfernt${format.reset}`,
    itemRoomAdded: `In %s wurde das Item %s ${format.color.green}hinzugefuegt${format.reset}`,
    itemRoomRemoved: `Aus %s wurde das Item %s ${format.color.red}entfernt${format.reset}`,
    toggleConnection: ` Durchgang zwischen %s und %s wurde %s!`,
    connectionOpen: `${format.color.green}geoeffnet${format.reset}`,
    connectionClosed: `${format.color.red}geschlossen${format.reset}`,
    showDmActionsBeginning: `Du kannst folgende Aktionen ausfuehren: `,
    showDmActionsEnding: `\nGebe gegebenenfalls geeignete Argumente fuer <> ein. Möchtest du weitere Informationen über einen Spieler haben, klicke in der Spielerliste auf den Namen des gewünschten Spielers.`
}

export const extras = {
    dungeonMasterId: 'dungeonmaster'
}

export const actionDescriptions = {
    move: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<norden|osten|sueden|westen>${format.reset} - Gehe in einen anschliessenden Raum, falls eine Verbindung besteht `, triggers.move),
    look: parseResponseString(`\n\t${format.bold}%s${format.reset} - Erhalte Informationen ueber den Raum in dem du dich gerade befindest `, triggers.look),
    inv: parseResponseString(`\n\t${format.bold}%s${format.reset} - Zeigt die Items in deinem Inventar an `, triggers.inventory),
    pickup: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Itemname>${format.reset} - Hebe ein Item aus dem Raum auf `, triggers.pickup),
    discard: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Itemname>${format.reset} - Lege ein Item aus deinem Inventar in den Raum ab `, triggers.discard),
    inspect: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Itemname>${format.reset} - Erhalte eine Beschreibung ueber ein Item in deinem Inventar `, triggers.inspect),
    unspecified: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<aktion>${format.reset} - Frage eine Aktion beim Dungeon Master an `, triggers.unspecified),
    message: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Nachricht>${format.reset} - Sende eine Nachricht in den Raum `, triggers.message),
    whisper: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Spieler> <Nachricht>${format.reset} - Sende eine Nachricht an einen Spieler in dem Raum `, triggers.whisper),
    messageMaster: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Nachricht>${format.reset} - Sende eine private Nachricht an den Dungeon Master `, triggers.messageMaster),
    help: parseResponseString(`\n\t${format.bold}%s${format.reset} - Wenn du nicht mehr weiterkommst `, triggers.help),
    showActions: parseResponseString(`\n\t${format.bold}%s${format.reset} - Erhalte eine Beschreibung alle ausfuehrbaren Aktionen `, triggers.showActions)
}

export const dmActionDescriptions = {
    addDamage: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Spielername> <Wert>${format.reset} - Erhöhe den Schaden eines Spielers `, triggers.addDamage),
    addHp: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Spielername> <Wert>${format.reset} - Erhöhe das Leben eines Spielers `, triggers.addHp),
    addMana: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Spielername> <Wert>${format.reset} - Erhöhe das Mana eines Spielers `, triggers.addMana),
    removeMana: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Spielername> <Wert>${format.reset} - Verringere das Mana eines Spielers `, triggers.removeMana),
    removeHp: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Spielername> <Wert>${format.reset} - Verringere das Leben eines Spielers `, triggers.removeHp),
    removeDamage: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Spielername> <Wert>${format.reset} - Verringere den Schaden eines Spielers `, triggers.removeDamage),
    changeRoom: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Spielername> <Raumname>${format.reset} - Ändere die Position eines Spielers `, triggers.changeRoom),
    removeItem: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Spielername> <Itemname>${format.reset} - Entferne ein Item von einem Spieler `, triggers.removeItem),
    removeRoomItem: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Spieler> <Raumname>${format.reset} - Entferne ein Item aus einem Raum `, triggers.removeRoomItem),
    addItem: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Spielername> <Itemname>${format.reset} - Gebe einem Spieler ein Item `, triggers.addItem),
    addRoomItem: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Raumname> <Itemname>${format.reset} - Lege ein Item in den Raum `, triggers.addRoomItem),
    kickPlayer: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Spielername>${format.reset} - Schmeiße einen Spieler aus der Lobby `, triggers.kickPlayer),
    whisper: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Spieler> <Nachricht>${format.reset} - Sende eine private Nachricht an einen Spieler `, triggers.whisper),
    broadcast: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Nachricht>${format.reset} - Sende eine Nachricht an alle Spieler `, triggers.broadcast),
    banPlayer: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Spielername>${format.reset} - Banne einen Spieler aus deinem Dungeon `, triggers.banPlayer),
    unbanPlayer: parseResponseString(`\n\t${format.bold}%s${format.reset} ${format.italic}<Spielername>${format.reset} - Entbanne einen Spieler aus deinem Dungeon `, triggers.unbanPlayer),
    showDmActions: parseResponseString(`\n\t${format.bold}%s${format.reset} - Erhalte eine Beschreibung alle ausführbaren Aktionen `, triggers.showDmActions),
    toggleConnection: parseResponseString(`\nÜber die Minimap können außerdem die Verbindungen getoggled werden. Klick dafür auf die Verbindung zwischen den Räumen.`),
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
