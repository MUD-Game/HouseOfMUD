import mongoose from "mongoose";
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

/**
 * encapsulation of the mongoose API
 */



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
        this.connection = mongoose.createConnection(connectionString);
        this.item = this.connection.model<Item>('Item', itemSchema)
        this.action = this.connection.model<Action>('Action', actionSchema)
        this.character = this.connection.model<Character>('Character', characterSchema)
        this.characterClass = this.connection.model<CharacterClass>('CharacterClass', characterClassSchema)
        this.characterGender = this.connection.model<CharacterGender>('CharacterGender', characterGenderSchema)
        this.characterSpecies = this.connection.model<CharacterSpecies>('CharacterSpecies', characterSpeciesSchema)
        this.dungeon = this.connection.model<Dungeon>('Dungeon', dungeonSchema)
        this.npc = this.connection.model<Npc>('Npc', npcSchema)
        this.room = this.connection.model<Room>('Room', roomSchema)
        this.user = this.connection.model<User>('User', userSchema)
    }

    /**
     * store a dungeon inside the 'dungeons' Collection of the connection
     * @param dungeonToStore the 'Dungeon' dataset that contains all information of the dungeon
     */
    async storeDungeon(dungeonToStore:Dungeon) {
        this.dungeon.create({
            id: dungeonToStore.id,
            name: dungeonToStore.name,
            description: dungeonToStore.description,
            creatorId: dungeonToStore.creatorId, 
            masterId: dungeonToStore.masterId,
            maxPlayers: dungeonToStore.maxPlayers,
            currentPlayers: dungeonToStore.currentPlayers,
            blacklist: dungeonToStore.blacklist,
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

    /**
     * get a dungeon from the 'dungeons' Collection in the Mongo database
     * @param id the id of the dungeon to get
     * @returns complete dungeon dataset with all sub objects
     */
    async getDungeon(id: string){
        const foundDungeon = await this.dungeon.findOne({id: id})
        return {
            id : foundDungeon!.id,
            name: foundDungeon!.name,
            description: foundDungeon!.description,
            creatorId: foundDungeon!.description,
            masterId: foundDungeon!.masterId,
            maxPlayers: foundDungeon!.maxPlayers,
            currentPlayers: foundDungeon!.currentPlayers,
            blacklist: foundDungeon!.blacklist,
            characters: (await foundDungeon!.populate('characters')).characters,
            characterClasses: (await foundDungeon!.populate('characterClasses')).characterClasses,
            characterSpecies: (await foundDungeon!.populate('characterSpecies')).characterSpecies,
            characterGender: (await foundDungeon!.populate('characterGender')).characterGender,
            rooms: (await foundDungeon!.populate('rooms')).rooms,
            items: (await foundDungeon!.populate('items')).items,
            npcs: (await foundDungeon!.populate('npcs')).npcs,
            actions: (await foundDungeon!.populate('actions')).actions
        }
    }

    /**
     * get the needed dungeon information for the supervisor 
     * @param id the id of the dungeon to get the information from
     * @returns the dungeon information (id, name, description, creatorId, masterId, maxPlayers, currentPlayers)
     */
    async getDungeonInfo(id: string){
        return (await this.dungeon.findOne({id: id}, 
            'id name description creatorId masterId maxPlayers currentPlayers'))
    }

    /**
     * get the dungeon information for the supervisor from all existing dungeons
     * @returns an array of the dungeon information (id, name, description, creatorId, masterId, maxPlayers, currentPlayers)
     */
    async getAllDungeonInfos(){
        return (await this.dungeon.find({}, 
            'id name description creatorId masterId maxPlayers currentPlayers'))
    }



    //TODO: get dungeon info für alle existierenden dungeons
    //TODO: get dungeon info (name, desc, maxplayer, currentplayer, creator, master) für Supervisor
    //TODO: get dungeon (alle infos ohne characters)
    //TODO: get characters from dungeon id
    //TODO: store characters for dungeon
    //TODO: editierten Raum speichern
    //TODO: editierten Character speichern
    //TODO: editierten Dungeon speichern
}