export interface ConnectionInfo {
    east: "open" | "inactive" | "closed";
    south: "open" | "inactive" | "closed";
}
  
export class ConnectionInfoImpl implements ConnectionInfo {
    east: "open" | "inactive" | "closed";
    south: "open" | "inactive" | "closed";

    constructor(
        east: "open" | "inactive" | "closed",
        south: "open" | "inactive" | "closed"
    ) {
        this.east = east;
        this.south = south;
    }
}