import { IDiContainer } from '../../shared/DIContainer';
import { IMessageBrokerFactory } from '../factories/interfaces/IMessageBrokerFactory';
import { IMessageBroker } from './interfaces/IMessageBroker';

export class GenericBrokerFactory implements IMessageBrokerFactory {
  constructor(private diContainer: IDiContainer) {}

  /**
   * Creates a message broker based on the provided connection key and URI.
   * @param {string} connectionKey - The key to identify the connection.
   * @return {IMessageBroker} The created message broker instance.
   */
  createMessageBroker(connectionKey: string): IMessageBroker {
    const brokerFactory = this.diContainer.resolve<
      IMessageBrokerFactory | undefined
    >(connectionKey);

    if (!brokerFactory) {
      throw new Error(`Broker factory not found: ${connectionKey}`);
    }

    return brokerFactory.createMessageBroker(connectionKey);
  }
}
