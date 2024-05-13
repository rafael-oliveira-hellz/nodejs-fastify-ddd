import { RabbitMQBroker } from "../messaging/amqp/RabbitMQBroker";
import { IMessageBroker } from "../messaging/interfaces/IMessageBroker";
import { IMessageBrokerFactory } from "./interfaces/IMessageBrokerFactory";

export class RabbitMQBrokerFactory implements IMessageBrokerFactory {
  createMessageBroker(): IMessageBroker {
    const uri = process.env.RABBITMQ_URI ?? "amqp://localhost";
    const broker = new RabbitMQBroker(uri);
    broker.connect();
    return broker;
  }
}
