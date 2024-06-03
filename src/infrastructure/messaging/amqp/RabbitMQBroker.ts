import amqp from 'amqplib';
import { IMessageBroker } from '../interfaces/IMessageBroker';

export class RabbitMQBroker implements IMessageBroker {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(private uri: string) {}

  /**
   * Connects to the AMQP server using the provided URI.
   *
   * @return {Promise<void>} Promise that resolves once the connection is established.
   */
  async connect(): Promise<void> {
    this.connection = await amqp.connect(this.uri);
    this.channel = await this.connection.createChannel();
  }

  /**
   * Publishes a message to the specified topic.
   *
   * @param {string} topic - The topic to which the message will be published.
   * @param {string} message - The message content to be published.
   * @return {Promise<void>} A Promise that resolves once the message is published.
   */
  async publish(topic: string, message: string): Promise<void> {
    await this.ensureChannel();

    await this.channel!.assertQueue(topic);
    this.channel!.sendToQueue(topic, Buffer.from(message));
  }

  /**
   * Subscribes to a topic and executes a callback when a message is received.
   *
   * @param {string} topic - The topic to subscribe to.
   * @param {(message: string) => void} onMessage - The callback function to handle incoming messages.
   * @return {Promise<void>} A Promise that resolves once the subscription is set up.
   */
  async subscribe(
    topic: string,
    onMessage: (message: string) => void,
  ): Promise<void> {
    await this.ensureChannel();
    await this.channel!.assertQueue(topic);
    this.channel!.consume(topic, (msg) => {
      if (msg) {
        onMessage(msg.content.toString());
        this.channel!.ack(msg);
      }
    });
  }

  /**
   * Closes the channel and connection if they are open.
   *
   * @return {Promise<void>} Promise that resolves once the channel and connection are closed.
   */
  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
      this.channel = null;
    }

    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }

  /**
   * Ensures that a channel is available for communication.
   *
   * @return {Promise<void>} Promise that resolves once the channel is successfully established.
   */
  private async ensureChannel(): Promise<void> {
    if (!this.connection) {
      await this.connect();
    }

    if (!this.connection) {
      throw new Error('Failed to establish a connection');
    }

    if (!this.channel) {
      this.channel = await this.connection.createChannel();
    }
  }
}
