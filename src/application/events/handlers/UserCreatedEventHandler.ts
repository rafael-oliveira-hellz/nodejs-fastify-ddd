import { UserCreatedEvent } from "../../events/UserCreatedEvent";

export class UserCreatedEventHandler {
  handle(event: UserCreatedEvent): void {
    console.log(`User created with ID: ${event.userId}`);
  }
}
