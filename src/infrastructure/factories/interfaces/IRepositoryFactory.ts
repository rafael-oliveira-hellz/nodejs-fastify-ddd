import { GenericRepository } from "../../database/GenericRepository";

export interface IRepositoryFactory {
  createRepository<T>(tableOrCollection: string): GenericRepository<T>;
}
