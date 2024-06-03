import { IWriteRepository } from '../interfaces/IRepository';
import { ITransactional } from '../interfaces/ITransactional';
import { MongoDBConnection } from './MongoDBConnection';

export class MongoDBCommandRepository<T>
  implements IWriteRepository<T>, ITransactional
{
  private dbConnection: MongoDBConnection;
  private _isConnected: boolean = false;

  constructor(dbConnection: MongoDBConnection) {
    this.dbConnection = dbConnection;
  }
  disconnect(): Promise<void> {
    return this.dbConnection.disconnect();
  }

  isConnected(): boolean {
    return this._isConnected;
  }

  async create(
    tableOrCollection: string,
    entity: Partial<T & { id?: string }>,
  ): Promise<T> {
    return await this.dbConnection.create(tableOrCollection, entity);
  }

  async update(
    tableOrCollection: string,
    id: string | number,
    entity: Partial<T>,
    options?: object,
  ): Promise<void> {
    await this.dbConnection.update(tableOrCollection, id, entity, options);
  }

  async delete(tableOrCollection: string, id: string | number): Promise<void> {
    await this.dbConnection.delete(tableOrCollection, id);
  }

  async beginTransaction(): Promise<void> {
    await this.dbConnection.beginTransaction();
  }

  async commit(): Promise<void> {
    await this.dbConnection.commit();
  }

  async rollback(): Promise<void> {
    await this.dbConnection.rollback();
  }
}
