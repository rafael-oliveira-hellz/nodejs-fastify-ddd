import { IQueryRepository } from './interfaces/IQueryRepository';
import { ITransactional } from './interfaces/ITransactional';

export class GenericQueryRepository<T> implements IQueryRepository<T> {
  private dbConnection: ITransactional & IQueryRepository<T>;

  constructor(
    dbConnection: ITransactional & IQueryRepository<T>,
    private tableOrCollectionName: string,
  ) {
    this.dbConnection = dbConnection;
  }

  async findById(id: string | number): Promise<T | null> {
    return await this.dbConnection.findById(this.tableOrCollectionName, id);
  }

  async findOne(_: string, criteria: Partial<T>): Promise<T | null> {
    return await this.dbConnection.findOne(
      this.tableOrCollectionName,
      criteria,
    );
  }

  async findAll(_: string, criteria: Partial<T>): Promise<T[]> {
    return await this.dbConnection.findAll(
      this.tableOrCollectionName,
      criteria,
    );
  }
}
