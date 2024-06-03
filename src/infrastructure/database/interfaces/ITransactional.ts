export interface ITransactional {
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  isConnected(): boolean;
  disconnect(): Promise<void>;
}
