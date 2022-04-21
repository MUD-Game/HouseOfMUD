import exp from "constants"

export interface IDungeon {
    id: string,
    name: string,
    description: string,
    creatorId: string,
    masterId: string,
    maxPlayers: number,
    currentPlayers: number,
    species: ICharacterSpecies[],
    classes: ICharacterClass[],
    genders: ICharacterGender[],
    rooms: IRoom[],
    blacklist: string[],
    actions: IActionElement[]
}

export class Dungeon implements IDungeon {
    id: string
    name: string
    description: string
    creatorId: string
    masterId: string
    maxPlayers: number
    currentPlayers: number
    species: ICharacterSpecies[]
    classes: ICharacterClass[]
    genders: ICharacterGender[]
    rooms: IRoom[]
    blacklist: string[]
    actions: IActionElement[]

    constructor(id: string, name: string, description: string, creatorId: string, masterId: string, maxPlayers: number, currentPlayers: number, species: ICharacterSpecies[], classes: ICharacterClass[],
        genders: ICharacterGender[], rooms: IRoom[], blacklist: string[], actions: IActionElement[]) {
        this.id = id
        this.name = name
        this.description = description
        this.creatorId = creatorId
        this.masterId = masterId
        this.maxPlayers = maxPlayers
        this.currentPlayers = currentPlayers
        this.species = species
        this.classes = classes
        this.genders = genders
        this.rooms = rooms
        this.blacklist = blacklist
        this.actions = actions
    }

}

export interface IUser {
    id: string,
    username: string,
    password: string
}

export class User implements IUser {
    id: string
    username: string
    password: string

    constructor(id: string, username: string, password: string) {
        this.id = id
        this.username = username
        this.password = password
    }
}

export interface ICharacterStats {
    hp: number,
    dmg: number,
    mana: number
}

export class CharacterStats implements ICharacterStats {
    hp: number
    dmg: number
    mana: number

    constructor(hp: number, dmg: number, mana: number) {
        this.hp = hp
        this.dmg = dmg
        this.mana = mana
    }
}

export interface ICharacterSpecies {
    id: string,
    name: string,
    description: string
}

export class CharacterSpecies implements ICharacterSpecies {
    id: string
    name: string
    description: string

    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

export interface ICharacterClass {
    id: string,
    name: string,
    description: string,
    maxStats: ICharacterStats,
    startStats: ICharacterStats
}

export class CharacterClass implements ICharacterClass {
    id: string
    name: string
    description: string
    maxStats: ICharacterStats
    startStats: ICharacterStats

    constructor(id: string, name: string, description: string, maxStats: ICharacterStats, startStats: ICharacterStats) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.maxStats = maxStats
        this.startStats = startStats
    }
}

export interface ICharacterGender {
    id: string,
    name: string,
    description: string
}

export class CharacterGender implements ICharacterGender {
    id: string
    name: string
    description: string

    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

export interface IItem {
    id: string,
    name: string,
    description: string
}

export class Item implements IItem {
    id: string
    name: string
    description: string

    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

export interface ICharacter {
    userId: string,
    dungeonId: string,
    name: string,
    className: string,
    species: ICharacterSpecies,
    gender: ICharacterGender,
    maxStats: ICharacterStats,
    currentStats: ICharacterStats,
    position: IRoom, //??????????
    inventory: IItem[]
}

export class Character implements ICharacter {
    userId: string
    dungeonId: string
    name: string
    className: string
    species: ICharacterSpecies
    gender: ICharacterGender
    maxStats: ICharacterStats
    currentStats: ICharacterStats
    position: IRoom
    inventory: IItem[]

    constructor(userId: string, dungeonId: string, name: string, className: string, species: ICharacterSpecies, gender: ICharacterGender, maxStats: ICharacterStats, currentStats: ICharacterStats, position: IRoom, inventory: IItem[]) {
        this.userId = userId;
        this.dungeonId = dungeonId
        this.name = name
        this.className = className
        this.species = species,
        this.gender = gender
        this.maxStats = maxStats
        this.currentStats = currentStats
        this.position = position
        this.inventory = inventory
    }
}

export interface IEvent {
    eventType: "additem" | "removeItem" | "addhp" | "removehp" | "adddmg" | "removedmg" | "addmana" | "removemana",
    value: IItem | number
}

export class Event implements IEvent {
    eventType: "additem" | "removeItem" | "addhp" | "removehp" | "adddmg" | "removedmg" | "addmana" | "removemana"
    value: number | IItem
    
    constructor(type: "additem" | "removeItem" | "addhp" | "removehp" | "adddmg" | "removedmg" | "addmana" | "removemana", value: number | IItem) {
        this.eventType = type;
        this.value = value
    }
}

export interface INpc {
    id: string,
    name: string,
    description: string,
    species: string
}

export class Npc implements INpc {
    id: string
    name: string
    description: string
    species: string

    constructor(id: string, name: string, description: string, species: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.species = species
    }
}

export interface IActionElement {
    id: string,
    command: string,
    output: string,
    description: string,
    events: IEvent[],
    itemsneeded: IItem[]
}

export class ActionElement implements IActionElement {
    id: string;
    command: string
    output: string
    description: string
    events: IEvent[]
    itemsneeded: IItem[]

    constructor(id: string, command: string, output: string, description: string, events: IEvent[], itemsneeded: IItem[]) {
        this.id = id,
        this.command = command,
        this.output = output,
        this.description = description,
        this.events = events,
        this.itemsneeded = itemsneeded
    }
}

export interface IConnectionInfo {
    east: "active" | "inactive" | "closed",
    south: "active" | "inactive" | "closed"
}

export class ConnectionInfo implements IConnectionInfo {
    east: "active" | "inactive" | "closed"
    south: "active" | "inactive" | "closed"

    constructor(east: "active" | "inactive" | "closed", south: "active" | "inactive" | "closed") {
        this.east = east
        this.south = south
    }
}

export interface IRoom {
    id: string,
    name: string,
    description: string,
    npcs: INpc[],
    items: IItem[],
    connections: IConnectionInfo,
    actions: IActionElement[]
}

export class Room implements IRoom {
    id: string
    name: string
    description: string
    npcs: INpc[]
    items: IItem[]
    connections: IConnectionInfo
    actions: IActionElement[]

    constructor(id: string, name: string, description: string, npcs: INpc[], items: IItem[], connections: IConnectionInfo, actions: IActionElement[]) {
        this.id = id
        this.name = name
        this.description = description
        this.npcs = npcs
        this.items = items
        this.connections = connections
        this.actions = actions
    }
}
