import { IReadDatabaseConnection } from "./interfaces/IReadDatabaseConnection";
import { IReadRepository } from "./interfaces/IReadRepository";

export class ReadRepository<T> implements IReadRepository<T> {
  constructor(
    private readDb: IReadDatabaseConnection,
    private tableOrCollection: string
  ) {}
  findById(id: string | number): Promise<T | null> {
    return this.readDb.findById<T>(this.tableOrCollection, id);
  }

  async findOne(criteria: Partial<T>): Promise<T | null> {
    return this.readDb.findOne<T>(this.tableOrCollection, criteria);
  }

  async findAll(criteria: Partial<T>): Promise<T[]> {
    return this.readDb.findAll<T>(this.tableOrCollection, criteria);
  }
}
