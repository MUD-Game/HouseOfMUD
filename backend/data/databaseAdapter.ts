import * as mongoose from "mongoose";
import { Action, actionSchema } from "./datasets/action";
import { Character, characterSchema } from "./datasets/character";
import { CharacterClass, characterClassSchema } from "./datasets/characterClass";
import { CharacterGender, characterGenderSchema } from "./datasets/characterGender";
import { CharacterSpecies, characterSpeciesSchema } from "./datasets/characterSpecies";
import { Dungeon, dungeonSchema } from "./datasets/dungeon";
import { Item, itemSchema } from "./datasets/item";
import { Npc, npcSchema } from "./datasets/npc";
import { Room, roomSchema } from "./datasets/room";
import { User, userSchema } from "./datasets/user";


export class DatabaseAdapter {
    connection: mongoose.Connection;
    item: mongoose.Model<Item>
    action: mongoose.Model<Action>
    character: mongoose.Model<Character>
    characterClass: mongoose.Model<CharacterClass>
    characterGender: mongoose.Model<CharacterGender>
    characterSpecies: mongoose.Model<CharacterSpecies>
    dungeon: mongoose.Model<Dungeon>
    npc: mongoose.Model<Npc>
    room: mongoose.Model<Room>
    user: mongoose.Model<User>

    constructor(connectionString: string){
        this.connection = mongoose.createConnection(connectionString)
        this.item = this.connection.model<Item>('Item', itemSchema)
        this.action = this.connection.model<Action>('Action', actionSchema)
        this.character = this.connection.model<Character>('Character', characterSchema)
        this.characterClass = this.connection.model<CharacterClass>('CharacterClass', characterClassSchema)
        this.characterGender = this.connection.model<CharacterGender>('CharacterGender', characterGenderSchema)
        this.characterSpecies = this.connection.model<CharacterSpecies>('CharacterSpezies', characterSpeciesSchema)
        this.dungeon = this.connection.model<Dungeon>('Dungeon', dungeonSchema)
        this.npc = this.connection.model<Npc>('Npc', npcSchema)
        this.room = this.connection.model<Room>('Room', roomSchema)
        this.user = this.connection.model<User>('User', userSchema)
    }

    async storeDungeon(dungeonToStore:Dungeon) {
        this.dungeon.create({
            dungeonId: dungeonToStore.dungeonId,
            name: dungeonToStore.name,
            description: dungeonToStore.description,
            creatorId: dungeonToStore.creatorId, 
            masterId: dungeonToStore.masterId,
            maxPlayers: dungeonToStore.maxPlayers,
            blacklist: dungeonToStore.blacklist,
            currentPlayers: dungeonToStore.currentPlayers,
            characters: await this.character.insertMany(dungeonToStore.characters),
            characterClasses: await this.characterClass.insertMany(dungeonToStore.characterClasses),
            characterSpecies: await this.characterSpecies.insertMany(dungeonToStore.characterSpecies),
            characterGender: await this.characterGender.insertMany(dungeonToStore.characterGender),
            rooms: await this.room.insertMany(dungeonToStore.rooms),
            items: await this.item.insertMany(dungeonToStore.items),
            npcs: await this.npc.insertMany(dungeonToStore.npcs),
            actions: await this.action.insertMany(dungeonToStore.actions)
        })
    }    
}