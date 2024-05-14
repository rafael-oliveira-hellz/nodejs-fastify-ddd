export interface IReadRepository<T> {
  findOne(collectionName: string, criteria: Partial<T>): Promise<T | null>;
  findById(collectionName: string, id: string | number): Promise<T | null>;
  findAll(collectionName: string, criteria: Partial<T>): Promise<T[]>;
}

export interface IWriteRepository<T> {
  create(collectionName: string, entity: T): Promise<void>;
  update(
    collectionName: string,
    id: string | number,
    entity: Partial<T>
  ): Promise<void>;
  delete(collectionName: string, id: string | number): Promise<void>;
}
