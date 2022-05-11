import { ActionElement } from "./actionElement";
import { Character } from "./character";
import { CharacterClass } from "./characterClass";
import { CharacterGender } from "./characterGender";
import { CharacterSpecies } from "./characterSpecies";
import { Item } from "./item";
import { Npc } from "./npc";
import { Room } from "./room";

/**
 * Dungeon interface containing all necessary data for dungeons.
 */
export interface Dungeon {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  globalActions: string[];
  masterId: string;
  maxPlayers: number;
  currentPlayers: number;
  characterSpecies: { [id: string]: CharacterSpecies };
  characterClasses: { [id: string]: CharacterClass };
  characterGenders: { [id: string]: CharacterGender };
  characters: { [name: string]: Character };
  rooms: { [id: string]: Room };
  blacklist: string[];
  actions: { [id: string]: ActionElement };
  items: { [id: string]: Item };
  npcs: { [id: string]: Npc };

  getId(): string
  getName(): string
  getDescription(): string
  getCreatorId(): string
  getMasterId(): string
  getMaxPlayers(): number
  getGlobalActions(): string[]
  getCurrentPlayers(): number
  getSpecies(speciesName: string): CharacterSpecies
  getClass(className: string): CharacterClass
  getGender(genderName: string): CharacterGender
  getCharacter(characterName: string): Character
  getRoom(roomId: string): Room
  getRoomByCoordinates(x: number, y: number): Room
  getRoomByName(roomName: string): Room
  getNorthernRoom(initialRoom: Room): Room
  getEasternRoom(initialRoom: Room): Room
  getSouthernRoom(initialRoom: Room): Room
  getWesternRoom(initialRoom: Room): Room
  getBlacklist(): string[]
  getAction(actionId: string): ActionElement
  getActions(): ActionElement[]
  getItem(itemId: string): Item
  getItemByName(itemName: string): Item
  getNpc(npcId: string): Npc

}

export class DungeonImpl implements Dungeon {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  masterId: string;
  maxPlayers: number;
  globalActions: string[];
  currentPlayers: number;
  characterSpecies: { [id: string]: CharacterSpecies };
  characterClasses: { [id: string]: CharacterClass };
  characterGenders: { [id: string]: CharacterGender };
  characters: { [name: string]: Character };
  rooms: { [id: string]: Room };
  blacklist: string[];
  actions: { [id: string]: ActionElement };
  items: { [id: string]: Item };
  npcs: { [id: string]: Npc };

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

  getSpecies(speciesId: string): CharacterSpecies {
    let species: CharacterSpecies = this.characterSpecies[speciesId]
    if (species === undefined) {
      throw new Error("Species does not exist");
    } else {
      return species;
    }
  }

  getClass(classId: string): CharacterClass {
    let characterClass: CharacterClass = this.characterClasses[classId]
    if (characterClass === undefined) {
      throw new Error("Class does not exist");
    } else {
      return characterClass;
    }
  }

  getGender(genderId: string): CharacterGender {
    let characterGender: CharacterGender = this.characterGenders[genderId]
    if (characterGender === undefined) {
      throw new Error("Gender does not exist");
    } else {
      return characterGender;
    }
  }

  getCharacter(characterName: string): Character {
    let character: Character = this.characters[characterName]
    if (character === undefined) {
      throw new Error("Character does not exist");
    } else {
      return character
    }
  }

  getRoom(roomId: string): Room {
    let room: Room = this.rooms[roomId]
    if (room === undefined) {
      throw new Error("Room does not exist");
    } else {
      return room;
    }
  }

  getRoomByCoordinates(x: number, y: number): Room {
    let room: Room | undefined = Object.values(this.rooms).find(room => room.xCoordinate === x && room.yCoordinate === y)
    if (room === undefined) {
      throw new Error("Room does not exist");
    } else {
      return room;
    }
  }

  getRoomByName(roomName: string):Room {
    let room: Room | undefined = Object.values(this.rooms).find(room => room.name === roomName)
    if (room === undefined) {
      throw new Error("Room does not exist");
    } else {
      return room;
    }
  }

  getGlobalActions(): string[] {
    return this.globalActions;
  }

  getNorthernRoom(initialRoom: Room): Room {
    return this.getRoomByCoordinates(
      initialRoom.xCoordinate,
      initialRoom.yCoordinate - 1
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
      initialRoom.yCoordinate + 1
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
    let action: ActionElement = this.actions[actionId]
    if (action === undefined) {
      throw new Error("Action does not exist!");
    } else {
      return action;
    }
  }

  getActions(): ActionElement[] {
    return Object.values(this.actions)
  }

  getItem(itemId: string): Item {
    let item: Item = this.items[itemId]
    if (item === undefined) {
      throw new Error("Item does not exist");
    } else {
      return item;
    }
  }

  getItemByName(itemName: string): Item {
    let item: Item | undefined = Object.values(this.items).find(item => item.getName() === itemName)
    if (item === undefined) {
      throw new Error("Item does not exist");
    } else {
      return item;
    }
  }

  getNpc(npcId: string): Npc {
    let npc: Npc = this.npcs[npcId]
    if (npc === undefined) {
      throw new Error("Npc does not exist");
    } else {
      return npc;
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
    npcs: Npc[],
    globalActions: string[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.creatorId = creatorId;
    this.masterId = masterId;
    this.maxPlayers = maxPlayers;
    this.globalActions = globalActions;
    this.currentPlayers = currentPlayers;
    this.characterSpecies = arrayToMap(species);
    this.characterClasses = arrayToMap(classes);
    this.characterGenders = arrayToMap(genders);
    this.characters = arrayToMapCharacters(characters);
    this.rooms = arrayToMap(rooms);
    this.blacklist = blacklist;
    this.actions = arrayToMap(actions);
    this.items = arrayToMap(items)
    this.npcs = arrayToMap(npcs)
  }
}

function arrayToMap(array: any[]): any {
  let map: { [id: string]: any } = {};
  array.forEach((obj: any) => {
    //let objWithoutID = (({ id, ...o}) => o)(obj); // remove id from object
    map[obj.id] = obj;
  });
  return map;
}

function arrayToMapCharacters(array: any[]): any {
  let map: { [name: string]: any } = {};
  array.forEach((obj: any) => {
    //let objWithoutID = (({ id, ...o}) => o)(obj); // remove id from object
    map[obj.name] = obj;
  });
  return map;
}