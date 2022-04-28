export interface ConnectionInfo {
    east: "active" | "inactive" | "closed";
    south: "active" | "inactive" | "closed";
}
  
export class ConnectionInfoImpl implements ConnectionInfo {
    east: "active" | "inactive" | "closed";
    south: "active" | "inactive" | "closed";

    constructor(
        east: "active" | "inactive" | "closed",
        south: "active" | "inactive" | "closed"
    ) {
        this.east = east;
        this.south = south;
    }
}