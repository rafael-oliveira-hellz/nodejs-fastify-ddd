export interface IReadDatabaseConnection {
  findOne<T>(
    tableOrCollection: string,
    criteria: Partial<T>,
  ): Promise<T | null>;
  findById<T>(
    tableOrCollection: string,
    id: string | number,
  ): Promise<T | null>;
  findAll<T>(tableOrCollection: string, criteria: Partial<T>): Promise<T[]>;
}
