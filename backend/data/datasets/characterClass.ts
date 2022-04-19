import {Schema, model} from "mongoose";

export interface CharacterClass{
    id: string,
    name: string,
    description: string,
    maxHp: number,
    maxDmg: number,
    maxMana: number,
    startHp: number,
    startDmg: number,
    startMana: number
}

const characterClassSchema = new Schema<CharacterClass>({
    name: {type: String, maxLength: 50},
    description: {type: String, maxLength: 500},
    maxHp: {type: Number},
    maxDmg: {type: Number},
    maxMana: {type: Number},
    startHp: {type: Number},
    startDmg: {type: Number},
    startMana: {type: Number}
});

const characterClass = model<CharacterClass>('CharacterClass', characterClassSchema);
export default characterClass;