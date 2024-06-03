import CONFIG from '../../../config/env-config';
import { IMessageBrokerFactory } from '../../factories/interfaces/IMessageBrokerFactory';
import { IMessageBroker } from '../interfaces/IMessageBroker';
import { RabbitMQBroker } from './RabbitMQBroker';

export class RabbitMQBrokerFactory implements IMessageBrokerFactory {
  /**
   * Creates a message broker using the provided URI.
   *
   * @param {string} uri - The URI for the message broker.
   * @return {IMessageBroker} The created message broker instance.
   */
  createMessageBroker(_connectionKey: string): IMessageBroker {
    const broker = new RabbitMQBroker(CONFIG.RABBITMQ.URI);
    broker.connect();
    return broker;
  }
}
