import { IWriteDatabaseConnection } from "./interfaces/IWriteDatabaseConnection";
import { IWriteRepository } from "./interfaces/IWriteRepository";

export class WriteRepository<T> implements IWriteRepository<T> {
  constructor(
    private writeDb: IWriteDatabaseConnection,
    private tableOrCollection: string
  ) {}

  async create(entity: T): Promise<void> {
    return this.writeDb.create<T>(this.tableOrCollection, entity);
  }

  async update(id: string | number, entity: Partial<T>): Promise<void> {
    return this.writeDb.update<T>(this.tableOrCollection, id, entity);
  }

  async delete(id: string | number): Promise<void> {
    return this.writeDb.delete<T>(this.tableOrCollection, id);
  }
}
