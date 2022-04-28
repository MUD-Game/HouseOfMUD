export class ConnectionInfo {
  east: "inactive" | "active" | "closed";
  south: "inactive" | "active" | "closed";

  constructor(east: "inactive" | "active" | "closed", south: "inactive" | "active" | "closed") {
    this.east = east;
    this.south = south;
  }
}
