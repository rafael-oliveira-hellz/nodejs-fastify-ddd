export interface IReadRepository<T> {
  findOne(
    tableOrCollectionName: string,
    criteria: Partial<T>,
  ): Promise<T | null>;
  findById(
    tableOrCollectionName: string,
    id: string | number,
  ): Promise<T | null>;
  findAll(tableOrCollectionName: string, criteria: Partial<T>): Promise<T[]>;
}

export interface IWriteRepository<T> {
  create(tableOrCollectionName: string, entity: Partial<T>): Promise<T>;
  update(
    tableOrCollectionName: string,
    id: string | number,
    entity: Partial<T>,
    options?: object,
  ): Promise<void>;
  delete(tableOrCollectionName: string, id: string | number): Promise<void>;
}
