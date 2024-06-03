import { IReadRepository } from '../interfaces/IRepository';
import { MongoDBConnection } from './MongoDBConnection';

export class MongoDBQueryRepository<T> implements IReadRepository<T> {
  private dbConnection: MongoDBConnection;

  constructor(dbConnection: MongoDBConnection) {
    this.dbConnection = dbConnection;
  }

  async findById(
    tableOrCollection: string,
    id: string | number,
  ): Promise<T | null> {
    return await this.dbConnection.findById(tableOrCollection, id);
  }

  async findOne(
    tableOrCollection: string,
    criteria: Partial<T>,
  ): Promise<T | null> {
    return await this.dbConnection.findOne(tableOrCollection, criteria);
  }

  async findAll(tableOrCollection: string, criteria: Partial<T>): Promise<T[]> {
    return await this.dbConnection.findAll(tableOrCollection, criteria);
  }
}
