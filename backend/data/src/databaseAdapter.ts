import mongoose from "mongoose";
import { Action, actionSchema } from "./datasets/action";
import { Character, characterSchema } from "./datasets/character";
import { CharacterClass, characterClassSchema } from "./datasets/characterClass";
import { CharacterGender, characterGenderSchema } from "./datasets/characterGender";
import { CharacterSpecies, characterSpeciesSchema } from "./datasets/characterSpecies";
import { CharacterStats } from "./datasets/charcterStats";
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

    constructor(connectionString: string, databaseName: string){
        this.connection = mongoose.createConnection(connectionString, {dbName: databaseName});
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
        return this.dungeon.create({
            name: dungeonToStore.name,
            description: dungeonToStore.description,
            creatorId: dungeonToStore.creatorId, 
            masterId: dungeonToStore.masterId,
            maxPlayers: dungeonToStore.maxPlayers,
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
        const foundDungeon = await this.dungeon.findOne({_id: new mongoose.Types.ObjectId(id)})
        if (foundDungeon == undefined){
            return undefined
        }
        return {
            _id : foundDungeon.id,
            name: foundDungeon.name,
            description: foundDungeon.description,
            creatorId: foundDungeon.description,
            masterId: foundDungeon.masterId,
            maxPlayers: foundDungeon.maxPlayers,
            blacklist: foundDungeon.blacklist,
            characters: (await foundDungeon.populate('characters')).characters,
            characterClasses: (await foundDungeon.populate('characterClasses')).characterClasses,
            characterSpecies: (await foundDungeon.populate('characterSpecies')).characterSpecies,
            characterGender: (await foundDungeon.populate('characterGender')).characterGender,
            rooms: (await foundDungeon.populate('rooms')).rooms,
            items: (await foundDungeon.populate('items')).items,
            npcs: (await foundDungeon.populate('npcs')).npcs,
            actions: (await foundDungeon.populate('actions')).actions
        }
    }

    /**
     * deletes a dungeon from the dungeons collection inside the database
     * @param dungeonId the ObjectId of the dungeon to delete
     * @returns the query response (information about the performed database action)
     */
    async deleteDungeon(dungeonId: string){
        const foundDungeon = await this.dungeon.findOneAndDelete(new mongoose.Types.ObjectId(dungeonId))
        if (foundDungeon == undefined){
            return undefined
        }
        foundDungeon.characters.forEach(async char => {
            await this.character.findByIdAndDelete(char)
        })
        foundDungeon.characterClasses.forEach(async charClass => {
            await this.characterClass.findByIdAndDelete(charClass)
        })
        foundDungeon.characterSpecies.forEach(async charSpec => {
            await this.characterSpecies.findByIdAndDelete(charSpec)
        })
        foundDungeon.characterGender.forEach(async charGen => {
            await this.characterGender.findByIdAndDelete(charGen)
        })
        foundDungeon.rooms.forEach(async r => {
            await this.room.findByIdAndDelete(r)
        })
        foundDungeon.items.forEach(async it => {
            await this.item.findByIdAndDelete(it)
        })
        foundDungeon.npcs.forEach(async npc => {
            await this.npc.findByIdAndDelete(npc)
        })
        foundDungeon.actions.forEach(async ac => {
            await this.action.findByIdAndDelete(ac)
        })
    }

    /**
     * updates a dungeon with a specified id with the new dungeon data (all character information will be taken over)
     * @param dungeonId the object id of the dungeon to update
     * @param newDungeon the new dungeon data
     * @returns the new Dungeon data
     */
    async updateDungeon(dungeonId: string, newDungeon: Dungeon){
        const oldDungeon = await this.dungeon.findOneAndDelete(new mongoose.Types.ObjectId(dungeonId))
        if (oldDungeon == undefined){
            return undefined
        }
        oldDungeon.rooms.forEach(async r => {
            await this.room.findByIdAndDelete(r)
        })
        oldDungeon.items.forEach(async it => {
            await this.item.findByIdAndDelete(it)
        })
        oldDungeon.npcs.forEach(async npc => {
            await this.npc.findByIdAndDelete(npc)
        })
        oldDungeon.actions.forEach(async ac => {
            await this.action.findByIdAndDelete(ac)
        })

        return this.dungeon.create({
            name: newDungeon.name,
            description: newDungeon.description,
            creatorId: newDungeon.creatorId, 
            masterId: newDungeon.masterId,
            maxPlayers: newDungeon.maxPlayers,
            blacklist: newDungeon.blacklist,
            characters: oldDungeon.characters,
            characterClasses: oldDungeon.characterClasses,
            characterSpecies: oldDungeon.characterSpecies,
            characterGender: oldDungeon.characterGender,
            rooms: await this.room.insertMany(newDungeon.rooms),
            items: await this.item.insertMany(newDungeon.items),
            npcs: await this.npc.insertMany(newDungeon.npcs),
            actions: await this.action.insertMany(newDungeon.actions)
        })
    }

    /**
     * get the needed dungeon information for the supervisor 
     * @param id the id of the dungeon to get the information from
     * @returns the dungeon information (id, name, description, creatorId, masterId, maxPlayers, currentPlayers)
     */
    async getDungeonInfo(id: string){
        return (this.dungeon.findOne({id: id}, 
            'id name description creatorId masterId maxPlayers currentPlayers'))
    }

    /**
     * get the dungeon information for the supervisor from all existing dungeons
     * @returns an array of the dungeon information (id, name, description, creatorId, masterId, maxPlayers, currentPlayers)
     */
    async getAllDungeonInfos(){
        return (this.dungeon.find({}, 
            'id name description creatorId masterId maxPlayers currentPlayers'))
    }

    /**
     * gets a list of all character datasets inside a dungeon
     * @param id the id of the dungeon to get the characters from
     * @returns an array of Characters (Promisses)
     */
    async getAllCharactersFromDungeon(id: string){
        const foundDungeon = await this.dungeon.findOne({_id: new mongoose.Types.ObjectId(id)})
        return (await foundDungeon!.populate('characters')).characters
    }
    
    /**
     * checks if a specified character exists inside of a dungeon
     * @param characterId the id of the dungeon to search for
     * @param dungeonId the id of the dungeon dungeon in which the character should exist
     * @returns true if the character could be found inside the dungeon, false if not
     */
    async characterExistsInDungeon(characterId: string, dungeonId: string){
        var foundFlag = false
        const foundDungeon = await this.dungeon.findOne({_id: new mongoose.Types.ObjectId(dungeonId)})
        const foundCharacters =  (await foundDungeon!.populate('characters')).characters
        foundCharacters.forEach(char => {
            if (char.id == characterId){
                foundFlag = true
            }            
        })
        return foundFlag
    }

    /**
     * creates a new character inside the characters collection and references it from the specified dungeon
     * @param newCharacter the character to store
     * @param dungeonId the id of the dungeon to reference the character from
     * @returns the query response (information about the performed database action)
     */
    async storeCharacterInDungeon(newCharacter: Character, dungeonId: string){
        return this.dungeon.updateOne({_id: dungeonId}, {$push: {characters: await this.character.create(newCharacter)}})
    }

    /**
     * deletes a character from the characters collection inside the database
     * @param characterId the id of the character to delete
     * @returns the query response (information about the performed database action)
     */
     async deleteCharacter(characterId: string){
        return this.character.deleteOne({id: characterId})
    }

    /**
     * updates the stats of an existing character
     * @param characterId the id of the character to update
     * @param stats the new stats for the character
     */
    async updateCharacterStats(characterId: string, stats: CharacterStats){
        await this.character.updateOne({id: characterId}, {currentStats: stats})
    }

    /**
     * updates a room inside from the rooms collection inside the database
     * @param room the updated room (has to have the same custom id as the room that should be updated)
     * @returns the query response (information about the performed database action)
     */
    async updateRoom(room: Room){
        return this.room.updateOne({id: room.id}, room)
    }
}