/**
 * Interfaces and classes for Dungeon datasets.
 */

import { __String } from "typescript"


/**
 * Dungeon interface containing all necessary data for dungeons.
 */
export interface Dungeon {
    dungeonId: string,
    name: string,
    description: string,
    creatorId: string,
    masterId: string,
    maxPlayers: number,
    currentPlayers: number,
    species: CharacterSpecies[],
    classes: CharacterClass[],
    genders: CharacterGender[],
    characters: Character[],
    rooms: Room[],
    blacklist: string[],
    actions: ActionElement[],
    items: Item[]
}

export class Dungeon implements Dungeon {
    dungeonId: string
    name: string
    description: string
    creatorId: string
    masterId: string
    maxPlayers: number
    currentPlayers: number
    species: CharacterSpecies[]
    classes: CharacterClass[]
    genders: CharacterGender[]
    characters: Character[]
    rooms: Room[]
    blacklist: string[]
    actions: ActionElement[]
    items: Item[]

    getName(): string {
        return this.name
    }

    getDescription(): string {
        return this.description
    }

    getCreatorId(): string {
        return this.creatorId
    }

    getMasterId(): string {
        return this.masterId
    }

    getMaxPlayers(): number {
        return this.maxPlayers
    }

    getCurrentPlayers(): number {
        return this.currentPlayers
    }

    getSpecies(speciesName: string): CharacterSpecies {
        let speciesIndex: number = this.species.findIndex(species => species.name === speciesName)
        if (speciesIndex === -1) {
            throw new Error("Species does not exist")
        } else {
            return this.species[speciesIndex]
        }
    }

    getClass(className: string): CharacterClass {
        let classIndex: number = this.classes.findIndex(characterClass => characterClass.name === className)
        if (classIndex === -1) {
            throw new Error("Class does not exist")
        } else {
            return this.classes[classIndex]
        }
    }

    getGender(genderName: string): CharacterGender {
        let genderIndex: number = this.genders.findIndex(gender => gender.name === genderName)
        if (genderIndex === -1) {
            throw new Error("Gender does not exist")
        } else {
            return this.genders[genderIndex]
        }
    }

    getCharacter(characterId: string): Character {
        let characterIndex: number = this.characters.findIndex(character => character.characterId === characterId)
        if (characterIndex === -1) {
            throw new Error("Character does not exist")
        } else {
            return this.characters[characterIndex]
        }
    }

    getCharacterByName(characterName: string): Character {
        let characterIndex: number = this.characters.findIndex(character => character.name === characterName)
        if (characterIndex === -1) {
            throw new Error("Character does not exist")
        } else {
            return this.characters[characterIndex]
        }
    }

    getRoom(roomId: string): Room {
        let roomIndex: number = this.rooms.findIndex(room => room.roomId === roomId)
        if (roomIndex === -1) {
            throw new Error("Room does not exist")
        } else {
            return this.rooms[roomIndex]
        }
    }

    getRoomByCoordinates(x: number, y: number): Room {
        let roomIndex: number = this.rooms.findIndex(room => room.xCoordinate === x && room.yCoordinate === y)
        if (roomIndex === -1) {
            throw new Error("Room does not exist")
        } else {
            return this.rooms[roomIndex]
        }
    }

    getNorthernRoom(initialRoom: Room): Room {
        return this.getRoomByCoordinates(initialRoom.xCoordinate, initialRoom.yCoordinate + 1)
    }

    getEasternRoom(initialRoom: Room): Room {
        return this.getRoomByCoordinates(initialRoom.xCoordinate + 1, initialRoom.yCoordinate)
    }

    getSouthernRoom(initialRoom: Room): Room {
        return this.getRoomByCoordinates(initialRoom.xCoordinate, initialRoom.yCoordinate - 1)
    }

    getWesternRoom(initialRoom: Room): Room {
        return this.getRoomByCoordinates(initialRoom.xCoordinate - 1, initialRoom.yCoordinate)
    }

    getBlacklist(): string[] {
        return this.blacklist
    }

    getAction(actionCommand: string): ActionElement {
        let actionIndex: number = this.actions.findIndex(action => action.command === actionCommand)
        if (actionIndex === -1) {
            throw new Error("Room does not exist")
        } else {
            return this.actions[actionIndex]
        }
    }

    getActions(): ActionElement[] {
        return this.actions
    }

    constructor(id: string, name: string, description: string, creatorId: string, masterId: string, maxPlayers: number, currentPlayers: number, species: CharacterSpecies[], classes: CharacterClass[],
        genders: CharacterGender[], characters: Character[], rooms: Room[], blacklist: string[], actions: ActionElement[], items: Item[]) {
        this.dungeonId = id
        this.name = name
        this.description = description
        this.creatorId = creatorId
        this.masterId = masterId
        this.maxPlayers = maxPlayers
        this.currentPlayers = currentPlayers
        this.species = species
        this.classes = classes
        this.genders = genders
        this.characters = characters
        this.rooms = rooms
        this.blacklist = blacklist
        this.actions = actions
        this.items = items
    }

    getId(): string {
        return this.dungeonId
    }
}

export interface User {
    userId: string,
    username: string,
    password: string
}

export class User implements User {
    userId: string
    username: string
    password: string

    constructor(id: string, username: string, password: string) {
        this.userId = id
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
    characterSpeciesId: string,
    name: string,
    description: string
}

export class CharacterSpecies implements CharacterSpecies {
    characterSpeciesId: string
    name: string
    description: string

    constructor(id: string, name: string, description: string) {
        this.characterSpeciesId = id;
        this.name = name;
        this.description = description;
    }
}

export interface CharacterClass {
    characterClassId: string,
    name: string,
    description: string,
    maxStats: CharacterStats,
    startStats: CharacterStats
}

export class CharacterClass implements CharacterClass {
    characterClassId: string
    name: string
    description: string
    maxStats: CharacterStats
    startStats: CharacterStats

    constructor(id: string, name: string, description: string, maxStats: CharacterStats, startStats: CharacterStats) {
        this.characterClassId = id;
        this.name = name;
        this.description = description;
        this.maxStats = maxStats
        this.startStats = startStats
    }
}

export interface CharacterGender {
    characterGenderId: string,
    name: string,
    description: string
}

export class CharacterGender implements CharacterGender {
    characterGenderId: string
    name: string
    description: string

    constructor(id: string, name: string, description: string) {
        this.characterGenderId = id;
        this.name = name;
        this.description = description;
    }
}

export interface Item {
    itemId: string,
    name: string,
    description: string
}

export class Item implements Item {
    itemId: string
    name: string
    description: string

    constructor(id: string, name: string, description: string) {
        this.itemId = id;
        this.name = name;
        this.description = description;
    }
}

export interface Character {
    characterId: string,
    userId: string,
    dungeonId: string,
    name: string,
    className: string,
    species: CharacterSpecies,
    gender: CharacterGender,
    maxStats: CharacterStats,
    currentStats: CharacterStats,
    position: string,
    inventory: string[]
}

export class Character implements Character {
    characterId: string
    userId: string
    dungeonId: string
    name: string
    className: string
    species: CharacterSpecies
    gender: CharacterGender
    maxStats: CharacterStats
    currentStats: CharacterStats
    position: string
    inventory: string[]

    constructor(id: string, userId: string, dungeonId: string, name: string, className: string, species: CharacterSpecies, gender: CharacterGender, maxStats: CharacterStats, currentStats: CharacterStats, position: string, inventory: string[]) {
        this.characterId = id
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

    getId(): string {
        return this.characterId
    }

    getName(): string {
        return this.name
    }

    getPosition(): string {
        return this.position
    }

    modifyPosition(destinationRoom: string) {
        this.position = destinationRoom
    }
}

export interface Event {
    eventType: "additem" | "removeItem" | "addhp" | "removehp" | "adddmg" | "removedmg" | "addmana" | "removemana",
    value: string | number
}

export class Event implements Event {
    eventType: "additem" | "removeItem" | "addhp" | "removehp" | "adddmg" | "removedmg" | "addmana" | "removemana"
    value: number | string
    
    constructor(type: "additem" | "removeItem" | "addhp" | "removehp" | "adddmg" | "removedmg" | "addmana" | "removemana", value: number | string) {
        this.eventType = type;
        this.value = value
    }
}

export interface Npc {
    npcId: string,
    name: string,
    description: string,
    species: string
}

export class Npc implements Npc {
    npcId: string
    name: string
    description: string
    species: string

    constructor(id: string, name: string, description: string, species: string) {
        this.npcId = id;
        this.name = name;
        this.description = description;
        this.species = species
    }
}

export interface ActionElement {
    actionId: string,
    command: string,
    output: string,
    description: string,
    events: Event[],
    itemsneeded: string[]
}

export class ActionElement implements ActionElement {
    actionId: string;
    command: string
    output: string
    description: string
    events: Event[]
    itemsneeded: string[]

    constructor(id: string, command: string, output: string, description: string, events: Event[], itemsneeded: string[]) {
        this.actionId = id,
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
    roomId: string,
    name: string,
    description: string,
    npcs: string[],
    items: string[],
    connections: ConnectionInfo,
    actions: string[]
    xCoordinate: number
    yCoordinate: number
}

export class Room implements Room {
    roomId: string
    name: string
    description: string
    npcs: string[]
    items: string[]
    connections: ConnectionInfo
    actions: string[]
    xCoordinate: number
    yCoordinate: number

    constructor(id: string, name: string, description: string, npcs: string[], items: string[], connections: ConnectionInfo, actions: string[], xCoordinate: number, yCoordinate: number) {
        this.roomId = id
        this.name = name
        this.description = description
        this.npcs = npcs
        this.items = items
        this.connections = connections
        this.actions = actions
        this.xCoordinate = xCoordinate
        this.yCoordinate = yCoordinate
    }

    getId(): string {
        return this.roomId
    }

    getName(): string {
        return this.name
    }

    getDescription(): string {
        return this.description
    }

    getEastConnection(): "active" | "inactive" | "closed" {
        return this.connections.east
    }

    getSouthConnection(): "active" | "inactive" | "closed" {
        return this.connections.south
    }
}


