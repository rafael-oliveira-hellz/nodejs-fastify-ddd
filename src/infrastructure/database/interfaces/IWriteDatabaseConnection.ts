import { IDatabaseConnection } from './IDatabaseConnection';

export interface IWriteDatabaseConnection extends IDatabaseConnection {
  create<T>(tableOrCollection: string, entity: Partial<T>): Promise<T>;
  update<T>(
    tableOrCollection: string,
    id: string | number,
    entity: Partial<T>,
    options?: object,
  ): Promise<void>;
  delete(tableOrCollection: string, id: string | number): Promise<void>;
}
