import { ConnectionInfo } from "./connectionInfo";

export interface Room {
    id: string;
    name: string;
    description: string;
    npcs: string[];
    items: string[];
    connections: ConnectionInfo;
    actions: string[];
    xCoordinate: number;
    yCoordinate: number;
  
    getId(): string
    getName(): string
    getDescription(): string
    getEastConnection(): "active" | "inactive" | "closed"
    getSouthConnection(): "active" | "inactive" | "closed"
    getItems(): string[]
    getNpcs(): string[]
    getActions(): string[]
}
  
export class RoomImpl implements Room {
    id: string;
    name: string;
    description: string;
    npcs: string[];
    items: string[];
    connections: ConnectionInfo;
    actions: string[];
    xCoordinate: number;
    yCoordinate: number;

    constructor(
        id: string,
        name: string,
        description: string,
        npcs: string[],
        items: string[],
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

    getEastConnection(): "active" | "inactive" | "closed" {
        return this.connections.east;
    }

    getSouthConnection(): "active" | "inactive" | "closed" {
        return this.connections.south;
    }

    getItems(): string[] {
        return this.items
    }

    getNpcs(): string[] {
        return this.npcs
    }

    getActions(): string[] {
        return this.actions
    }
}