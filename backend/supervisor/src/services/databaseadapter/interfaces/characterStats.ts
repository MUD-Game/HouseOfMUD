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