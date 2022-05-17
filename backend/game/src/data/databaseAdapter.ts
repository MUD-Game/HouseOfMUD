import mongoose from "mongoose";
import { ActionDataset, actionSchema } from "./datasets/actionDataset";
import { CharacterDataset, characterSchema } from "./datasets/characterDataset";
import { CharacterClassDataset, characterClassSchema } from "./datasets/characterClassDataset";
import { CharacterGenderDataset, characterGenderSchema } from "./datasets/characterGenderDataset";
import { CharacterSpeciesDataset, characterSpeciesSchema } from "./datasets/characterSpeciesDataset";
import { CharacterStats } from "./datasets/charcterStats";
import { DungeonDataset, dungeonSchema } from "./datasets/dungeonDataset";
import { ItemDataset, itemSchema } from "./datasets/itemDataset";
import { NpcDataset, npcSchema } from "./datasets/npcDataset";
import { RoomDataset, roomSchema } from "./datasets/roomDataset";
import { User, userSchema } from "./datasets/userDataset";
import { Room } from "./interfaces/room";
import { Schema } from "js-yaml";

function arrayToMap(array: any[]): any {
    let map: { [id: string]: any } = {};
    array.forEach((obj: any) => {
        let objWithoutID = (({ id, ...o }) => o)(obj); // remove id from object
        map[obj.id] = objWithoutID;
    });
    return map;
}

function mapToArray(map: any): any[] {
    let array: any[] = [];
    for (let id in map) {
        array.push({ ...map[id], id: id });
    }
    return array;
}



/**
 * encapsulation of the mongoose API
 */
export class DatabaseAdapter {
   


    public database: string;

    connection: mongoose.Connection;
    item: mongoose.Model<ItemDataset>
    action: mongoose.Model<ActionDataset>
    character: mongoose.Model<CharacterDataset>
    characterClass: mongoose.Model<CharacterClassDataset>
    characterGenders: mongoose.Model<CharacterGenderDataset>
    characterSpecies: mongoose.Model<CharacterSpeciesDataset>
    dungeon: mongoose.Model<DungeonDataset>
    npc: mongoose.Model<NpcDataset>
    room: mongoose.Model<RoomDataset>
    user: mongoose.Model<User>

    constructor(connectionString: string, database: string) {
        this.database = database;
        this.connection = mongoose.createConnection(connectionString, { dbName: database });
        this.item = this.connection.model<ItemDataset>('Item', itemSchema)
        this.action = this.connection.model<ActionDataset>('Action', actionSchema)
        this.character = this.connection.model<CharacterDataset>('Character', characterSchema)
        this.characterClass = this.connection.model<CharacterClassDataset>('CharacterClass', characterClassSchema)
        this.characterGenders = this.connection.model<CharacterGenderDataset>('CharacterGender', characterGenderSchema)
        this.characterSpecies = this.connection.model<CharacterSpeciesDataset>('CharacterSpecies', characterSpeciesSchema)
        this.dungeon = this.connection.model<DungeonDataset>('Dungeon', dungeonSchema)
        this.npc = this.connection.model<NpcDataset>('Npc', npcSchema)
        this.room = this.connection.model<RoomDataset>('Room', roomSchema)
        this.user = this.connection.model<User>('User', userSchema)
    }
    /**
     * store a dungeon inside the 'dungeons' Collection of the connection
     * @param dungeonToStore the 'Dungeon' dataset that contains all information of the dungeon
     */
    async storeDungeon(dungeonToStore: DungeonDataset) {
        return this.dungeon.create({
            name: dungeonToStore.name,
            description: dungeonToStore.description,
            password: dungeonToStore.password,
            creatorId: dungeonToStore.creatorId,
            masterId: dungeonToStore.masterId,
            maxPlayers: dungeonToStore.maxPlayers,
            blacklist: dungeonToStore.blacklist,
            characters: await this.character.insertMany(dungeonToStore.characters),
            characterClasses: await this.characterClass.insertMany(dungeonToStore.characterClasses),
            characterSpecies: await this.characterSpecies.insertMany(dungeonToStore.characterSpecies),
            characterGenders: await this.characterGenders.insertMany(dungeonToStore.characterGenders),
            globalActions: dungeonToStore.globalActions,
            rooms: await this.room.insertMany(dungeonToStore.rooms),
            items: await this.item.insertMany(dungeonToStore.items),
            npcs: await this.npc.insertMany(dungeonToStore.npcs),
            actions: await this.action.insertMany(dungeonToStore.actions)
        })
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        const foundUser = await this.user.findOne({ email: email }, 'username email');
        if (foundUser) {
            return foundUser;
        }
        return undefined;
    }

    async updatePassword(email: string, password: string) {
        return this.user.updateOne({ email: email }, { password: password });
    }

    async checkIfCharacterExists(name: string, dungeonID: string) {
        const foundCharacter = await this.character.findOne({ name: name, dungeonID: dungeonID });
        if (foundCharacter) {
            return true;
        }
        return false;
    }


    /**
     * get a dungeon from the 'dungeons' Collection in the Mongo database
     * @param id the id of the dungeon to get
     * @returns complete dungeon dataset with all sub objects
     */
    async getDungeon(id: string): Promise<DungeonDataset | undefined> {
        const foundDungeon = await this.dungeon.findOne({ _id: new mongoose.Types.ObjectId(id) })
        if (foundDungeon == undefined) {
            return undefined
        }
        return {
            name: foundDungeon.name,
            description: foundDungeon.description,
            password: foundDungeon.password,
            creatorId: foundDungeon.creatorId,
            masterId: foundDungeon.masterId,
            maxPlayers: foundDungeon.maxPlayers,
            globalActions: foundDungeon.globalActions,
            blacklist: foundDungeon.blacklist,
            characters: (await foundDungeon.populate('characters')).characters,
            characterClasses: (await foundDungeon.populate('characterClasses')).characterClasses,
            characterSpecies: (await foundDungeon.populate('characterSpecies')).characterSpecies,
            characterGenders: (await foundDungeon.populate('characterGenders')).characterGenders,
            rooms: (await foundDungeon.populate('rooms')).rooms,
            items: (await foundDungeon.populate('items')).items,
            npcs: (await foundDungeon.populate('npcs')).npcs,
            actions: (await foundDungeon.populate('actions')).actions
        }
    }

    // get dungeons based on user id



    /**
     * deletes a dungeon from the dungeons collection inside the database
     * @param dungeonId the ObjectId of the dungeon to delete
     * @returns the query response (information about the performed database action)
     */
    async deleteDungeon(dungeonId: string) {
        const foundDungeon = await this.dungeon.findOneAndDelete({ _id: new mongoose.Types.ObjectId(dungeonId) })
        if (foundDungeon == undefined) {
            return undefined
        }
        foundDungeon.characters.forEach(async (char: any) => {
            await this.character.findByIdAndDelete(char)
        })
        foundDungeon.characterClasses.forEach(async (charClass: any) => {
            await this.characterClass.findByIdAndDelete(charClass)
        })
        foundDungeon.characterSpecies.forEach(async (charSpec: any) => {
            await this.characterSpecies.findByIdAndDelete(charSpec)
        })
        foundDungeon.characterGenders.forEach(async (charGen: any) => {
            await this.characterGenders.findByIdAndDelete(charGen)
        })
        foundDungeon.rooms.forEach(async (r: any) => {
            await this.room.findByIdAndDelete(r)
        })
        foundDungeon.items.forEach(async (it: any) => {
            await this.item.findByIdAndDelete(it)
        })
        foundDungeon.npcs.forEach(async (npc: any) => {
            await this.npc.findByIdAndDelete(npc)
        })
        foundDungeon.actions.forEach(async (ac: any) => {
            await this.action.findByIdAndDelete(ac)
        })
    }

    /**
     * updates a dungeon with a specified id with the new dungeon data (all character information will be taken over)
     * @param dungeonId the object id of the dungeon to update
     * @param newDungeon the new dungeon data
     * @returns the new Dungeon data
     */
    async updateDungeon(dungeonId: string, newDungeon: DungeonDataset) {
        const oldDungeon = await this.dungeon.findOneAndDelete({ _id: new mongoose.Types.ObjectId(dungeonId) })
        if (oldDungeon == undefined) {
            return undefined
        }
        oldDungeon.rooms.forEach(async (r: any) => {
            await this.room.findByIdAndDelete(r)
        })
        oldDungeon.items.forEach(async (it: any) => {
            await this.item.findByIdAndDelete(it)
        })
        oldDungeon.npcs.forEach(async (npc: any) => {
            await this.npc.findByIdAndDelete(npc)
        })
        oldDungeon.actions.forEach(async (ac: any) => {
            await this.action.findByIdAndDelete(ac)
        })
        oldDungeon.characterClasses.forEach(async (charClass: any) => {
            await this.characterClass.findByIdAndDelete(charClass)
        })
        oldDungeon.characterSpecies.forEach(async (charSpec: any) => {
            await this.characterSpecies.findByIdAndDelete(charSpec)
        })
        oldDungeon.characterGenders.forEach(async (charGen: any) => {
            await this.characterGenders.findByIdAndDelete(charGen)
        })


        return this.dungeon.create({
            _id: oldDungeon._id,
            name: newDungeon.name,
            description: newDungeon.description,
            password: newDungeon.password,
            creatorId: oldDungeon.creatorId,
            masterId: oldDungeon.creatorId,
            maxPlayers: newDungeon.maxPlayers,
            blacklist: oldDungeon.blacklist,
            globalActions: newDungeon.globalActions,
            characters: oldDungeon.characters,
            characterClasses: await this.characterClass.insertMany(newDungeon.characterClasses),
            characterSpecies: await this.characterSpecies.insertMany(newDungeon.characterSpecies),
            characterGenders: await this.characterGenders.insertMany(newDungeon.characterGenders),
            rooms: await this.room.insertMany(newDungeon.rooms),
            items: await this.item.insertMany(newDungeon.items),
            npcs: await this.npc.insertMany(newDungeon.npcs),
            actions: await this.action.insertMany(newDungeon.actions)
        })
    }

    /**
     * get the needed dungeon information for the supervisor 
     * @param id the id of the dungeon to get the information from
     * @returns the dungeon information (id, name, description, creatorId, password, masterId, maxPlayers, currentPlayers)
     */
    async getDungeonInfo(id: string) {
        return (this.dungeon.findOne({ id: id },
            'id name description password creatorId masterId maxPlayers currentPlayers'))
    }

    async getUserId(user: string): Promise<string | undefined> {
        if (user === "root") {
            return "root";
        }
        const foundUser = await this.user.findOne({ username: user }, '_id');
        if (foundUser) {
            return foundUser._id.toString();
        } else {
            return undefined;
        }
    }


    /**
     * get the dungeon information for the supervisor from all existing dungeons
     * @returns an array of the dungeon information (id, name, description, password, creatorId, masterId, maxPlayers, currentPlayers)
     */
    async getAllDungeonInfos() {
        return (this.dungeon.find({},
            'id name description password creatorId masterId maxPlayers currentPlayers'))
    }

    /**
     * gets a list of all character datasets inside a dungeon
     * @param id the id of the dungeon to get the characters from
     * @returns an array of Characters (Promisses)
     */
    async getAllCharactersFromDungeon(id: string) {
        const foundDungeon = await this.dungeon.findOne({ _id: new mongoose.Types.ObjectId(id) })
        return (await foundDungeon!.populate('characters')).characters
    }

    /**
     * checks if a specified character exists inside of a dungeon
     * @param characterId the id of the dungeon to search for
     * @param dungeonId the id of the dungeon dungeon in which the character should exist
     * @returns true if the character could be found inside the dungeon, false if not
     */
    async characterExistsInDungeon(characterName: string, dungeonId: string) {
        return await this.getCharacterFromDungeon(characterName, dungeonId) !== null;
    }

    /**
     * creates a new character inside the characters collection and references it from the specified dungeon
     * @param newCharacter the character to store
     * @param dungeonId the id of the dungeon to reference the character from
     * @returns the query response (information about the performed database action)
     */
    async storeCharacterInDungeon(newCharacter: CharacterDataset, dungeonId: string) {
        const foundDungeon = await this.dungeon.findOne({ _id: new mongoose.Types.ObjectId(dungeonId) }, 'characterClasses');
        const characterClasses = await foundDungeon!.populate({ path: 'characterClasses', match: { id: { $eq: newCharacter.characterClass } } });
        if (characterClasses.characterClasses.length > 0) {
            const maxStats = characterClasses.characterClasses[0].maxStats;
            newCharacter.maxStats = maxStats;
            newCharacter.currentStats = maxStats;
            return this.dungeon.updateOne({ _id: dungeonId }, { $push: { characters: await this.character.create(newCharacter) } })
        }
        return null;
    }

    /**
     * deletes a character from the characters collection inside the database
     * @param characterId the id of the character to delete
     * @returns the query response (information about the performed database action)
     */
    async deleteCharacter(characterId: string) {
        return this.character.deleteOne({ _id: characterId })
    }

    /**
     * updates the stats and position of an existing character
     * @param updatedCharacter the updated character data
     * @param dungeonId the id of the dungeon in which the character exists
     */
    async updateCharacterInDungeon(updatedCharacter: CharacterDataset, dungeonId: string) {
        let oldCharacter = await this.getCharacterFromDungeon(updatedCharacter.name, dungeonId)
        if (oldCharacter !== null) {
            await this.character.updateOne(
                oldCharacter,
                updatedCharacter
            );
        }
    }

    async updateBlacklistInDungeon(updatedBlacklist: string[], dungeonId: string) {
        let dungeonToUpdate = await this.dungeon.findOne({ _id: new mongoose.Types.ObjectId(dungeonId) })
        if (dungeonToUpdate?.blacklist != undefined) {
            dungeonToUpdate.blacklist = updatedBlacklist;
        }
        dungeonToUpdate?.save();
    }

    async isBanned(userId: string, dungeonId: string): Promise<boolean> {
        console.log(userId);
        let dungeon = await this.dungeon.findOne({ _id: new mongoose.Types.ObjectId(dungeonId) }, { blacklist: { $elemMatch: { $eq: userId } } });
        console.log(dungeon);
        if (dungeon) {
            if (dungeon.blacklist.includes(userId)) {
                return true;
            }
        }
        return false;
    }

    /**
     * updates a room inside from the rooms collection inside the database
     * @param room the updated room (has to have the same custom id as the room that should be updated)
     * @returns the query response (information about the performed database action)
     */
    async updateRooms(rooms: RoomDataset[], dungeonId: string) {
        let dungeonRoomIds: RoomDataset[] | undefined = (await this.dungeon.findOne({ _id: new mongoose.Types.ObjectId(dungeonId) }, 'rooms'))?.rooms
        console.log(dungeonRoomIds)
        if (dungeonRoomIds != undefined) {
            await Promise.all(dungeonRoomIds.map(async id => {
                let foundRoom = (await this.room.findOne({ _id: id })) as RoomDataset
                await this.room.updateOne(foundRoom, rooms.find(room => room.id == foundRoom.id));
            }));
        }
    }

    async getDungeonCharacterAttributes(dungeonId: string) {
        const foundDungeon = await this.dungeon.findOne({ _id: new mongoose.Types.ObjectId(dungeonId) }, 'characterClasses characterSpecies characterGenders');
        if (foundDungeon == undefined) {
            return undefined
        }
        return {
            classes: (await foundDungeon.populate('characterClasses')).characterClasses,
            species: (await foundDungeon.populate('characterSpecies')).characterSpecies,
            genders: (await foundDungeon.populate('characterGenders')).characterGenders,
        }
    }

    /**
     * deletes a specified user from the database
     * @param username the username of the user to delete
     * @returns the document of the deleted user
     */
    async deleteUser(username: string) {
        return this.user.deleteOne({ username: username });
    }

    /**
     * stores a new user inside the database
     * @param user user object to store
     * @returns the created user document
     */
    async registerUser(user: User) {
        return this.user.create(user);
    }

    /**
     * gets the password from a specified user from the database
     * @param username the user to get the password from
     * @returns the password of the user
     */
    async getPassword(username: string) {
        return (await this.user.findOne({ username: username }))?.password;
    }

    /**
     * checks if a specified user exists in the database
     * @param username the user to search for
     * @returns true if the user exists, false if not
     */
    async checkIfUserExists(username: string) {
        return (await this.user.findOne({ username: username })) != null;
    }

    /**
     * checks if a specified mail exists for an user
     * @param email the email to search for
     * @returns true is the email exists, false if not
     */
    async checkIfEmailExists(email: string) {
        return (await this.user.findOne({ email: email })) != null
    }

    /**
     * gets an array of all characters from a user in a specified dungeon
     * @param username the user that owns the characters
     * @param dungeonId the dungeon for which the characters were created
     * @returns an array of all characters from the specified user in the specified dungeon
     */
    async getAllCharactersFromUserInDungeon(username: string, dungeonId: string): Promise<CharacterDataset[]> {
        const foundDungeon = await this.dungeon.findOne({ _id: new mongoose.Types.ObjectId(dungeonId) });
        let result = await foundDungeon!.populate({ path: 'characters', match: { userId: { $eq: username } } });
        return result.characters;
    }

    /**
     * gets a specified character from dungeon from database
     * @param characterName the character name of the character to get
     * @returns the found character
     */
    async getCharacterFromDungeon(characterName: string, dungeonId: string): Promise<CharacterDataset | null> {
        const foundDungeon = await this.dungeon.findOne({ _id: new mongoose.Types.ObjectId(dungeonId) });
        let result = await foundDungeon!.populate({ path: 'characters', match: { name: { $eq: characterName } } });
        if (result.characters.length > 0) {
            return result.characters[0];
        }
        return null
    }

    async getUserIdFromCharacter(characterToUnban: string, dungeonId:string) {
        let character = await this.character.findOne({ name: characterToUnban, dungeonId: dungeonId });
        return character?.userId || undefined;
    }
}