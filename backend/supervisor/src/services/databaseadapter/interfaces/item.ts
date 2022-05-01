export interface Item {
    id: string;
    name: string;
    description: string;
  
    getId(): string
    getName(): string
    getDescription(): string
}
  
export class ItemImpl implements Item {
    id: string;
    name: string;
    description: string;

    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    getId(): string {
        return this.id
    }

    getName(): string {
        return this.name
    }

    getDescription(): string {
        return this.description
    }
}