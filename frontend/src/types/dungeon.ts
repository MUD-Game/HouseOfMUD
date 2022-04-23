export interface MudDungeon {
    id: string;
    name: string;
    description: string;
    creatorId: string;
    masterId: string;
    maxPlayers: number;
    currentPlayers: number;
    species: MudCharacterSpecies[];
    classes: MudCharacterClass[];
    genders: MudCharacterGender[];
    rooms: MudRoom[];
    blacklist: string[];
    actions: MudActionElement[];
}

export interface MudUser {
    id: string;
    username: string;
    password: string;
}

export interface MudCharacterStats {
    hp: number;
    dmg: number;
    mana: number;
}

export interface MudCharacterSpecies {
    id: string;
    name: string;
    description: string;
}

export interface MudCharacterClass {
    id: string;
    name: string;
    description: string;
    maxStats: MudCharacterStats;
    startStats: MudCharacterStats;
}

export interface MudCharacterGender {
    id: string;
    name: string;
    description: string;
}

export interface MudItem {
    id: string;
    name: string;
    description: string;
}

export interface MudCharacter {
    userId: string;
    dungeonId: string;
    name: string;
    className: string;
    species: MudCharacterSpecies;
    gender: MudCharacterGender;
    maxStats: MudCharacterStats;
    currentStats: MudCharacterStats;
    position: MudRoom; //??????????
    inventory: MudItem[];
}

export interface MudEvent {
    eventType:
        | 'additem'
        | 'removeItem'
        | 'addhp'
        | 'removehp'
        | 'adddmg'
        | 'removedmg'
        | 'addmana'
        | 'removemana';
    value: number;
}

export interface MudNpc {
    id: string;
    name: string;
    description: string;
    species: string;
}

export interface MudActionElement {
    id: string;
    command: string;
    output: string;
    description: string;
    events: MudEvent[];
    itemsneeded: number[];
}

export interface MudConnectionInfo {
    east: 'active' | 'inactive' | 'closed';
    south: 'active' | 'inactive' | 'closed';
}

export interface MudRoom {
    id: string;
    name: string;
    description: string;
    npcs: MudNpc[];
    items: MudItem[];
    connections: MudConnectionInfo;
    actions: MudActionElement[];
}
