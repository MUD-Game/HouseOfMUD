export class ActionEvent {
  eventType: string;
  value: string;

  constructor(eventType: string, value: string) {
    this.eventType = eventType;
    this.value = value;
  }
}
