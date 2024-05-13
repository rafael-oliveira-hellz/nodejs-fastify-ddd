import { IDatabaseConnection } from "./IDatabaseConnection";

export interface IWriteDatabaseConnection extends IDatabaseConnection {
  create<T>(tableOrCollection: string, entity: Partial<T>): Promise<void>;
  update<T>(
    tableOrCollection: string,
    id: string | number,
    entity: Partial<T>
  ): Promise<void>;
  delete<T>(tableOrCollection: string, id: string | number): Promise<void>;
}
