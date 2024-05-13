import { IMessageBroker } from "../../messaging/interfaces/IMessageBroker";

export interface IMessageBrokerFactory {
  createMessageBroker(): IMessageBroker;
}
