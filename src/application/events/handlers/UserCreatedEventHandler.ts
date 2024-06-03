import { IMessageBrokerFactory } from '../../../infrastructure/factories/interfaces/IMessageBrokerFactory';
import { IMessageBroker } from '../../../infrastructure/messaging/interfaces/IMessageBroker';
import DIContainer from '../../../shared/DIContainer';
import { UserCreatedEvent } from '../../events/UserCreatedEvent';

export class UserCreatedEventHandler {
  private rabbitMQBroker: IMessageBroker;

  constructor() {
    /** Resolve the MessageBrokerFactory from the DIContainer. */
    const messageBrokerFactory = DIContainer.resolve<IMessageBrokerFactory>(
      'MessageBrokerFactory',
    );

    /** Create a RabbitMQ message broker. */
    this.rabbitMQBroker = messageBrokerFactory.createMessageBroker(
      'RabbitMQBrokerFactory',
    );
  }

  /**
   * Asynchronously handles the UserCreatedEvent by logging the user creation with ID,
   * publishing the event to RabbitMQ, and closing the RabbitMQ broker.
   *
   * @param {UserCreatedEvent} event - The UserCreatedEvent triggering the handler.
   * @return {Promise<void>} A Promise that resolves when the handling is complete.
   */
  async handle(event: UserCreatedEvent): Promise<void> {
    console.log(`User created with ID: ${event.userId}`);

    console.log('RABBITMQ_URI:', process.env.RABBITMQ_URI);

    try {
      await this.rabbitMQBroker.publish(
        'user-created',
        `User created with ID: ${event.userId}`,
      );
    } catch (error) {
      console.log(error);
    } finally {
      await this.rabbitMQBroker.close();
    }
  }
}
