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
  masterId: string;
  maxPlayers: number;
  currentPlayers: number;
  characterSpecies: CharacterSpecies[];
  characterClasses: CharacterClass[];
  characterGenders: CharacterGender[];
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
  characterSpecies: CharacterSpecies[];
  characterClasses: CharacterClass[];
  characterGenders: CharacterGender[];
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
    let speciesIndex: number = this.characterSpecies.findIndex(
      (species) => species.name === speciesName
    );
    if (speciesIndex === -1) {
      throw new Error("Species does not exist");
    } else {
      return this.characterSpecies[speciesIndex];
    }
  }

  getClass(className: string): CharacterClass {
    let classIndex: number = this.characterClasses.findIndex(
      (characterClass) => characterClass.name === className
    );
    if (classIndex === -1) {
      throw new Error("Class does not exist");
    } else {
      return this.characterClasses[classIndex];
    }
  }

  getGender(genderName: string): CharacterGender {
    let genderIndex: number = this.characterGenders.findIndex(
      (gender) => gender.name === genderName
    );
    if (genderIndex === -1) {
      throw new Error("Gender does not exist");
    } else {
      return this.characterGenders[genderIndex];
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
    this.characterSpecies = species;
    this.characterClasses = classes;
    this.characterGenders = genders;
    this.characters = characters;
    this.rooms = rooms;
    this.blacklist = blacklist;
    this.actions = actions;
    this.items = items
    this.npcs = npcs
  }
}