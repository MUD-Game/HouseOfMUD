export interface CharacterStats {
    hp: number;
    dmg: number;
    mana: number;

    getHp(): number
    getDmg(): number
    getMana(): number
    setHp(hpnew: number):void
    setDmg(dmgnew: number):void
    setMana(mananew: number):void
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

    getHp(): number {
        return this.hp
    }
    getDmg(): number {
        return this.dmg
    }
    getMana(): number {
        return this.mana
    }
    setDmg(dmgnew: number):void {
        this.dmg = dmgnew
    }
    setHp(hpnew: number):void {
        this.hp = hpnew
    }
    setMana(mananew: number):void {
        this.mana = mananew
    }
        
}