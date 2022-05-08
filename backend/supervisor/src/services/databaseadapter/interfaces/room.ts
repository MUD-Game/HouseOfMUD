import { ConnectionInfo } from "./connectionInfo";
import { ItemInfo } from "./itemInfo";

export interface Room {
    id: string;
    name: string;
    description: string;
    npcs: string[];
    items: ItemInfo[];
    connections: ConnectionInfo;
    actions: string[];
    xCoordinate: number;
    yCoordinate: number;
  
    getId(): string
    getName(): string
    getDescription(): string
    getEastConnection(): "open" | "inactive" | "closed"
    getSouthConnection(): "open" | "inactive" | "closed"
    getItemInfos(): ItemInfo[]
    getNpcs(): string[]
    getActions(): string[]

    setEastConnection(status: string): any
    setSouthConnection(status: string): any
}
  
export class RoomImpl implements Room {
    id: string;
    name: string;
    description: string;
    npcs: string[];
    items: ItemInfo[];
    connections: ConnectionInfo;
    actions: string[];
    xCoordinate: number;
    yCoordinate: number;

    constructor(
        id: string,
        name: string,
        description: string,
        npcs: string[],
        items: ItemInfo[],
        connections: ConnectionInfo,
        actions: string[],
        xCoordinate: number,
        yCoordinate: number
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.npcs = npcs;
        this.items = items;
        this.connections = connections;
        this.actions = actions;
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getEastConnection(): "open" | "inactive" | "closed" {
        return this.connections.east;
    }

    getSouthConnection(): "open" | "inactive" | "closed" {
        return this.connections.south;
    }

    getItemInfos(): ItemInfo[] {
        return this.items
    }

    getNpcs(): string[] {
        return this.npcs
    }

    getActions(): string[] {
        return this.actions
    }

    setEastConnection(statusString: string) {
        let status: "open" | "inactive" | "closed" = statusString as "open" | "inactive" | "closed";
        if (status === "inactive") {
            throw new Error("Cannot set room connection to inactive");
        } else {
            this.connections.east = status;
        }
    }

    setSouthConnection(statusString: string) {
        let status: "open" | "inactive" | "closed" = statusString as "open" | "inactive" | "closed";
        if (status === "inactive") {
            throw new Error("Cannot set room connection to inactive");
        } else {
            this.connections.south = status;
        }
    }
}