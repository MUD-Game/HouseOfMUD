export class CharacterStats {
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