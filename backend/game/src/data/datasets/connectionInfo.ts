export class ConnectionInfo {
  east: "inactive" | "open" | "closed";
  south: "inactive" | "open" | "closed";

  constructor(east: "inactive" | "open" | "closed", south: "inactive" | "open" | "closed") {
    this.east = east;
    this.south = south;
  }
}
