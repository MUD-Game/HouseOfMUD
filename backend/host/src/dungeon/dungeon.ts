export interface Dungeon {
    id: string,
    name: string,
    description: string,
    creatorId: string,
    masterId: string,
    maxPlayers: number,
    currentPlayers: number,
    species: CharacterSpecies[],
    classes: CharacterClass[],
    genders: CharacterGender[],
    rooms: Room[],
    blacklist: string[],
    actions: ActionElement[]
}

export class Dungeon implements Dungeon {
    id: string
    name: string
    description: string
    creatorId: string
    masterId: string
    maxPlayers: number
    currentPlayers: number
    species: CharacterSpecies[]
    classes: CharacterClass[]
    genders: CharacterGender[]
    rooms: Room[]
    blacklist: string[]
    actions: ActionElement[]

    constructor(id: string, name: string, description: string, creatorId: string, masterId: string, maxPlayers: number, currentPlayers: number, species: CharacterSpecies[], classes: CharacterClass[],
        genders: CharacterGender[], rooms: Room[], blacklist: string[], actions: ActionElement[]) {
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

export interface User {
    id: string,
    username: string,
    password: string
}

export class User implements User {
    id: string
    username: string
    password: string

    constructor(id: string, username: string, password: string) {
        this.id = id
        this.username = username
        this.password = password
    }
}

export interface CharacterStats {
    hp: number,
    dmg: number,
    mana: number
}

export class CharacterStats implements CharacterStats {
    hp: number
    dmg: number
    mana: number

    constructor(hp: number, dmg: number, mana: number) {
        this.hp = hp
        this.dmg = dmg
        this.mana = mana
    }
}

export interface CharacterSpecies {
    id: string,
    name: string,
    description: string
}

export class CharacterSpecies implements CharacterSpecies {
    id: string
    name: string
    description: string

    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

export interface CharacterClass {
    id: string,
    name: string,
    description: string,
    maxStats: CharacterStats,
    startStats: CharacterStats
}

export class CharacterClass implements CharacterClass {
    id: string
    name: string
    description: string
    maxStats: CharacterStats
    startStats: CharacterStats

    constructor(id: string, name: string, description: string, maxStats: CharacterStats, startStats: CharacterStats) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.maxStats = maxStats
        this.startStats = startStats
    }
}

export interface CharacterGender {
    id: string,
    name: string,
    description: string
}

export class CharacterGender implements CharacterGender {
    id: string
    name: string
    description: string

    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

export interface Item {
    id: string,
    name: string,
    description: string
}

export class Item implements Item {
    id: string
    name: string
    description: string

    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

export interface Character {
    userId: string,
    dungeonId: string,
    name: string,
    className: string,
    species: CharacterSpecies,
    gender: CharacterGender,
    maxStats: CharacterStats,
    currentStats: CharacterStats,
    position: Room, //??????????
    inventory: Item[]
}

export class Character implements Character {
    userId: string
    dungeonId: string
    name: string
    className: string
    species: CharacterSpecies
    gender: CharacterGender
    maxStats: CharacterStats
    currentStats: CharacterStats
    position: Room
    inventory: Item[]

    constructor(userId: string, dungeonId: string, name: string, className: string, species: CharacterSpecies, gender: CharacterGender, maxStats: CharacterStats, currentStats: CharacterStats, position: Room, inventory: Item[]) {
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
    value: Item | number
}

export class Event implements IEvent {
    eventType: "additem" | "removeItem" | "addhp" | "removehp" | "adddmg" | "removedmg" | "addmana" | "removemana"
    value: number | Item
    
    constructor(type: "additem" | "removeItem" | "addhp" | "removehp" | "adddmg" | "removedmg" | "addmana" | "removemana", value: number | Item) {
        this.eventType = type;
        this.value = value
    }
}

export interface Npc {
    id: string,
    name: string,
    description: string,
    species: string
}

export class Npc implements Npc {
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

export interface ActionElement {
    id: string,
    command: string,
    output: string,
    description: string,
    events: Event[],
    itemsneeded: Item[]
}

export class ActionElement implements ActionElement {
    id: string;
    command: string
    output: string
    description: string
    events: Event[]
    itemsneeded: Item[]

    constructor(id: string, command: string, output: string, description: string, events: IEvent[], itemsneeded: Item[]) {
        this.id = id,
        this.command = command,
        this.output = output,
        this.description = description,
        this.events = events,
        this.itemsneeded = itemsneeded
    }
}

export interface ConnectionInfo {
    east: "active" | "inactive" | "closed" ,
    south: "active" | "inactive" | "closed"
}

export class ConnectionInfo implements ConnectionInfo {
    east: "active" | "inactive" | "closed" 
    south: "active" | "inactive" | "closed"

    constructor(east: "active" | "inactive" | "closed", south: "active" | "inactive" | "closed") {
        this.east = east
        this.south = south
    }
}

export interface Room {
    id: string,
    name: string,
    description: string,
    npcs: Npc[],
    items: Item[],
    connections: ConnectionInfo,
    actions: ActionElement[]
}

export class Room implements Room {
    id: string
    name: string
    description: string
    npcs: Npc[]
    items: Item[]
    connections: ConnectionInfo
    actions: ActionElement[]

    constructor(id: string, name: string, description: string, npcs: Npc[], items: Item[], connections: ConnectionInfo, actions: ActionElement[]) {
        this.id = id
        this.name = name
        this.description = description
        this.npcs = npcs
        this.items = items
        this.connections = connections
        this.actions = actions
    }
}
