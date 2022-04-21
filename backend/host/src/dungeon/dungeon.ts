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

export interface IUser {
    id: string,
    username: string,
    password: string
}

export interface ICharacterStats {
    hp: number,
    dmg: number,
    mana: number
}

export interface ICharacterSpecies {
    id: string,
    name: string,
    description: string
}

export interface ICharacterClass {
    id: string,
    name: string,
    description: string,
    maxStats: ICharacterStats,
    startStats: ICharacterStats
}

export interface ICharacterGender {
    id: string,
    name: string,
    description: string
}

export interface IItem {
    id: string,
    name: string,
    description: string
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

export interface IEvent {
    eventType: "additem" | "removeItem" | "addhp" | "removehp" | "adddmg" | "removedmg" | "addmana" | "removemana",
    value: IItem | number
}

export interface INpc {
    id: string,
    name: string,
    description: string,
    species: string
}

export interface IActionElement {
    id: string,
    command: string,
    output: string,
    description: string,
    events: IEvent[],
    itemsneeded: IItem[]
}

export interface IConnectionInfo {
    east: "active" | "inactive" | "closed",
    south: "active" | "inactive" | "closed"
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

export class Event implements IEvent {
    eventType: "additem" | "removeItem" | "addhp" | "removehp" | "adddmg" | "removedmg" | "addmana" | "removemana"
    value: number | IItem
    
    constructor(type: "additem" | "removeItem" | "addhp" | "removehp" | "adddmg" | "removedmg" | "addmana" | "removemana", value: number | IItem) {
        this.eventType = type;
        this.value = value
    }
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

