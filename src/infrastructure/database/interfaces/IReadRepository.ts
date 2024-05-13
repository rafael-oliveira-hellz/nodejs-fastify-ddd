export interface IReadRepository<T> {
  findOne(criteria: Partial<T>): Promise<T | null>;
  findById(id: string | number): Promise<T | null>;
  findAll(criteria: Partial<T>): Promise<T[]>;
}
