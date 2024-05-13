import amqp from "amqplib";
import { IMessageBroker } from "../interfaces/IMessageBroker";

export class RabbitMQBroker implements IMessageBroker {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(private uri: string) {}

  async connect(): Promise<void> {
    this.connection = await amqp.connect(this.uri);
    this.channel = await this.connection.createChannel();
  }

  async publish(topic: string, message: string): Promise<void> {
    this.ensureChannel();

    await this.channel!.assertQueue(topic);
    this.channel!.sendToQueue(topic, Buffer.from(message));
  }

  async subscribe(
    topic: string,
    onMessage: (message: string) => void
  ): Promise<void> {
    this.ensureChannel();
    await this.channel!.assertQueue(topic);
    this.channel!.consume(topic, (msg) => {
      if (msg) {
        onMessage(msg.content.toString());
        this.channel!.ack(msg);
      }
    });
  }

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

  private async ensureChannel(): Promise<void> {
    if (!this.connection) {
      await this.connect();
    }

    if (!this.connection) {
      throw new Error("Failed to establish a connection");
    }

    if (!this.channel) {
      this.channel = await this.connection.createChannel();
    }
  }
}
