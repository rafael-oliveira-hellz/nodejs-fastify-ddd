export interface IMessageBroker {
  publish(topic: string, message: string): Promise<void>;
  subscribe(topic: string, onMessage: (message: string) => void): Promise<void>;
  close(): Promise<void>;
}
