/**
 * Interfaces and classes for Dungeon datasets.
 */

/**
 * Dungeon interface containing all necessary data for dungeons.
 */
export interface Dungeon {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  masterId: string;
  maxPlayers: number;
  currentPlayers: number;
  species: CharacterSpecies[];
  classes: CharacterClass[];
  genders: CharacterGender[];
  characters: Character[];
  rooms: Room[];
  blacklist: string[];
  actions: ActionElement[];
  items: Item[];
  npcs: Npc[];

  getId(): string
  getName(): string
  getDescription(): string
  getCreatorId(): string
  getMasterId(): string
  getMaxPlayers(): number
  getCurrentPlayers(): number
  getSpecies(speciesName: string): CharacterSpecies
  getClass(className: string): CharacterClass
  getGender(genderName: string): CharacterGender
  getCharacter(characterId: string): Character
  getCharacterByName(characterName: string): Character
  getRoom(roomId: string): Room
  getRoomByCoordinates(x: number, y: number): Room
  getNorthernRoom(initialRoom: Room): Room
  getEasternRoom(initialRoom: Room): Room
  getSouthernRoom(initialRoom: Room): Room
  getWesternRoom(initialRoom: Room): Room
  getBlacklist(): string[]
  getAction(actionId: string): ActionElement
  getActions(): ActionElement[]
  getItem(itemId: string): Item
  getNpc(npcId: string): Npc

}

export class DungeonImpl implements Dungeon {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  masterId: string;
  maxPlayers: number;
  currentPlayers: number;
  species: CharacterSpecies[];
  classes: CharacterClass[];
  genders: CharacterGender[];
  characters: Character[];
  rooms: Room[];
  blacklist: string[];
  actions: ActionElement[];
  items: Item[];
  npcs: Npc[];

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getCreatorId(): string {
    return this.creatorId;
  }

  getMasterId(): string {
    return this.masterId;
  }

  getMaxPlayers(): number {
    return this.maxPlayers;
  }

  getCurrentPlayers(): number {
    return this.currentPlayers;
  }

  getSpecies(speciesName: string): CharacterSpecies {
    let speciesIndex: number = this.species.findIndex(
      (species) => species.name === speciesName
    );
    if (speciesIndex === -1) {
      throw new Error("Species does not exist");
    } else {
      return this.species[speciesIndex];
    }
  }

  getClass(className: string): CharacterClass {
    let classIndex: number = this.classes.findIndex(
      (characterClass) => characterClass.name === className
    );
    if (classIndex === -1) {
      throw new Error("Class does not exist");
    } else {
      return this.classes[classIndex];
    }
  }

  getGender(genderName: string): CharacterGender {
    let genderIndex: number = this.genders.findIndex(
      (gender) => gender.name === genderName
    );
    if (genderIndex === -1) {
      throw new Error("Gender does not exist");
    } else {
      return this.genders[genderIndex];
    }
  }

  getCharacter(characterId: string): Character {
    let characterIndex: number = this.characters.findIndex(
      (character) => character.id === characterId
    );
    if (characterIndex === -1) {
      throw new Error("Character does not exist");
    } else {
      return this.characters[characterIndex];
    }
  }

  getCharacterByName(characterName: string): Character {
    let characterIndex: number = this.characters.findIndex(
      (character) => character.name === characterName
    );
    if (characterIndex === -1) {
      throw new Error("Character does not exist");
    } else {
      return this.characters[characterIndex];
    }
  }

  getRoom(roomId: string): Room {
    let roomIndex: number = this.rooms.findIndex(
      (room) => room.id === roomId
    );
    if (roomIndex === -1) {
      throw new Error("Room does not exist");
    } else {
      return this.rooms[roomIndex];
    }
  }

  getRoomByCoordinates(x: number, y: number): Room {
    let roomIndex: number = this.rooms.findIndex(
      (room) => room.xCoordinate === x && room.yCoordinate === y
    );
    if (roomIndex === -1) {
      throw new Error("Room does not exist");
    } else {
      return this.rooms[roomIndex];
    }
  }

  getNorthernRoom(initialRoom: Room): Room {
    return this.getRoomByCoordinates(
      initialRoom.xCoordinate,
      initialRoom.yCoordinate + 1
    );
  }

  getEasternRoom(initialRoom: Room): Room {
    return this.getRoomByCoordinates(
      initialRoom.xCoordinate + 1,
      initialRoom.yCoordinate
    );
  }

  getSouthernRoom(initialRoom: Room): Room {
    return this.getRoomByCoordinates(
      initialRoom.xCoordinate,
      initialRoom.yCoordinate - 1
    );
  }

  getWesternRoom(initialRoom: Room): Room {
    return this.getRoomByCoordinates(
      initialRoom.xCoordinate - 1,
      initialRoom.yCoordinate
    );
  }

  getBlacklist(): string[] {
    return this.blacklist;
  }

  getAction(actionId: string): ActionElement {
    let actionIndex: number = this.actions.findIndex(
      (action) => action.id === actionId
    );
    if (actionIndex === -1) {
      throw new Error("Room does not exist");
    } else {
      return this.actions[actionIndex];
    }
  }

  getActions(): ActionElement[] {
    return this.actions;
  }

  getItem(itemId: string): Item {
    let itemIndex: number = this.items.findIndex(
        (item) => item.id === itemId
      );
      if (itemIndex === -1) {
        throw new Error("Room does not exist");
      } else {
        return this.items[itemIndex];
      }
  }

  getNpc(npcId: string): Npc {
    let npcIndex: number = this.npcs.findIndex(
        (npc) => npc.id === npcId
      );
      if (npcIndex === -1) {
        throw new Error("Room does not exist");
      } else {
        return this.npcs[npcIndex];
      }
  }

  constructor(
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
    characters: Character[],
    rooms: Room[],
    blacklist: string[],
    actions: ActionElement[],
    items: Item[],
    npcs: Npc[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.creatorId = creatorId;
    this.masterId = masterId;
    this.maxPlayers = maxPlayers;
    this.currentPlayers = currentPlayers;
    this.species = species;
    this.classes = classes;
    this.genders = genders;
    this.characters = characters;
    this.rooms = rooms;
    this.blacklist = blacklist;
    this.actions = actions;
    this.items = items
    this.npcs = npcs
  }

  
}

export interface User {
  id: string;
  username: string;
  password: string;
}

export class UserImpl implements User {
  id: string;
  username: string;
  password: string;

  constructor(id: string, username: string, password: string) {
    this.id = id;
    this.username = username;
    this.password = password;
  }
}

export interface CharacterStats {
  hp: number;
  dmg: number;
  mana: number;
}

export class CharacterStatsImpl implements CharacterStats {
  hp: number;
  dmg: number;
  mana: number;

  constructor(hp: number, dmg: number, mana: number) {
    this.hp = hp;
    this.dmg = dmg;
    this.mana = mana;
  }
}

export interface CharacterSpecies {
  id: string;
  name: string;
  description: string;
}

export class CharacterSpeciesImpl implements CharacterSpecies {
  id: string;
  name: string;
  description: string;

  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  maxStats: CharacterStats;
  startStats: CharacterStats;
}

export class CharacterClassImpl implements CharacterClass {
 id: string;
  name: string;
  description: string;
  maxStats: CharacterStats;
  startStats: CharacterStats;

  constructor(
    id: string,
    name: string,
    description: string,
    maxStats: CharacterStats,
    startStats: CharacterStats
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.maxStats = maxStats;
    this.startStats = startStats;
  }
}

export interface CharacterGender {
  id: string;
  name: string;
  description: string;
}

export class CharacterGenderImpl implements CharacterGender {
  id: string;
  name: string;
  description: string;

  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

export interface Item {
  id: string;
  name: string;
  description: string;

  getName(): string
  getDescription(): string
}

export class ItemImpl implements Item {
  id: string;
  name: string;
  description: string;

  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  getName(): string {
      return this.name
  }

  getDescription(): string {
      return this.description
  }
}

export interface Character {
  id: string;
  userId: string;
  dungeonId: string;
  name: string;
  className: string;
  species: CharacterSpecies;
  gender: CharacterGender;
  maxStats: CharacterStats;
  currentStats: CharacterStats;
  position: string;
  inventory: string[];

  getId(): string
  getName(): string
  getPosition(): string
  modifyPosition(destinationRoom: string): any
  getInventory(): string[]

}

export class CharacterImpl implements Character {
  id: string;
  userId: string;
  dungeonId: string;
  name: string;
  className: string;
  species: CharacterSpecies;
  gender: CharacterGender;
  maxStats: CharacterStats;
  currentStats: CharacterStats;
  position: string;
  inventory: string[];

  constructor(
    id: string,
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
  ) {
    this.id = id;
    this.userId = userId;
    this.dungeonId = dungeonId;
    this.name = name;
    this.className = className;
    this.species = species; 
    this.gender = gender;
    this.maxStats = maxStats;
    this.currentStats = currentStats;
    this.position = position;
    this.inventory = inventory;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPosition(): string {
    return this.position;
  }

  modifyPosition(destinationRoom: string): any {
    this.position = destinationRoom;
  }

  getInventory(): string[] {
      return this.inventory
  }
}

export interface Event {
  eventType:
    | "additem"
    | "removeItem"
    | "addhp"
    | "removehp"
    | "adddmg"
    | "removedmg"
    | "addmana"
    | "removemana";
  value: Item | number;
}

export class EventImpl implements Event {
  eventType:
    | "additem"
    | "removeItem"
    | "addhp"
    | "removehp"
    | "adddmg"
    | "removedmg"
    | "addmana"
    | "removemana";
  value: number | Item;

  constructor(
    type:
      | "additem"
      | "removeItem"
      | "addhp"
      | "removehp"
      | "adddmg"
      | "removedmg"
      | "addmana"
      | "removemana",
    value: number | Item
  ) {
    this.eventType = type;
    this.value = value;
  }
}

export interface Npc {
  id: string;
  name: string;
  description: string;
  species: string;

  getName(): string
}

export class NpcImpl implements Npc {
  id: string;
  name: string;
  description: string;
  species: string;

  constructor(id: string, name: string, description: string, species: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.species = species;
  }

  getName(): string {
      return this.name
  }
}

export interface ActionElement {
  id: string;
  command: string;
  output: string;
  description: string;
  events: Event[];
  itemsneeded: string[];

  getCommand(): string
}

export class ActionElementImpl implements ActionElement {
  id: string;
  command: string;
  output: string;
  description: string;
  events: Event[];
  itemsneeded: string[];

  constructor(
    id: string,
    command: string,
    output: string,
    description: string,
    events: Event[],
    itemsneeded: string[]
  ) {
    (this.id = id),
      (this.command = command),
      (this.output = output),
      (this.description = description),
      (this.events = events),
      (this.itemsneeded = itemsneeded);
  }

  getCommand(): string {
      return this.command
  }
}

export interface ConnectionInfo {
  east: "active" | "inactive" | "closed";
  south: "active" | "inactive" | "closed";
}

export class ConnectionInfoImpl implements ConnectionInfo {
  east: "active" | "inactive" | "closed";
  south: "active" | "inactive" | "closed";

  constructor(
    east: "active" | "inactive" | "closed",
    south: "active" | "inactive" | "closed"
  ) {
    this.east = east;
    this.south = south;
  }
}

export interface Room {
  id: string;
  name: string;
  description: string;
  npcs: string[];
  items: string[];
  connections: ConnectionInfo;
  actions: string[];
  xCoordinate: number;
  yCoordinate: number;

  getId(): string
  getName(): string
  getDescription(): string
  getEastConnection(): "active" | "inactive" | "closed"
  getSouthConnection(): "active" | "inactive" | "closed"
  getItems(): string[]
  getNpcs(): string[]
  getActions(): string[]
}

export class RoomImpl implements Room {
  id: string;
  name: string;
  description: string;
  npcs: string[];
  items: string[];
  connections: ConnectionInfo;
  actions: string[];
  xCoordinate: number;
  yCoordinate: number;

  constructor(
    id: string,
    name: string,
    description: string,
    npcs: string[],
    items: string[],
    connections: ConnectionInfo,
    actions: string[],
    xCoordinate: number,
    yCoordinate: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.npcs = npcs;
    this.items = items;
    this.connections = connections;
    this.actions = actions;
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getEastConnection(): "active" | "inactive" | "closed" {
    return this.connections.east;
  }

  getSouthConnection(): "active" | "inactive" | "closed" {
    return this.connections.south;
  }

  getItems(): string[] {
      return this.items
  }

  getNpcs(): string[] {
      return this.npcs
  }

  getActions(): string[] {
      return this.actions
  }
}
