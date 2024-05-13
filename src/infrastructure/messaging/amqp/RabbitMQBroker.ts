import amqp from "amqplib";
import { IMessageBroker } from "../interfaces/IMessageBroker";

export class RabbitMQBroker implements IMessageBroker {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private uri: string) {}

  async connect(): Promise<void> {
    this.connection = await amqp.connect(this.uri);
    this.channel = await this.connection.createChannel();
  }

  async publish(topic: string, message: string): Promise<void> {
    if (!this.channel) {
      throw new Error("Channel not initialized");
    }
    await this.channel.assertQueue(topic);
    this.channel.sendToQueue(topic, Buffer.from(message));
  }

  async subscribe(
    topic: string,
    onMessage: (message: string) => void
  ): Promise<void> {
    await this.channel.assertQueue(topic);
    this.channel.consume(topic, (msg) => {
      if (msg) {
        onMessage(msg.content.toString());
        this.channel.ack(msg);
      }
    });
  }

  async close(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}
