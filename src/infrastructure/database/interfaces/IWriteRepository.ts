export interface IWriteRepository<T> {
  create(entity: T): Promise<void>;
  update(id: string | number, entity: Partial<T>): Promise<void>;
  delete(id: string | number): Promise<void>;
}
