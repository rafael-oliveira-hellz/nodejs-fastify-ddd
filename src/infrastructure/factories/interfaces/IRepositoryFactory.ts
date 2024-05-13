import { IReadRepository } from "../../database/interfaces/IReadRepository";
import { IWriteRepository } from "../../database/interfaces/IWriteRepository";

export interface IRepositoryFactory {
  createReadRepository<T>(tableOrCollection: string): IReadRepository<T>;
  createWriteRepository<T>(tableOrCollection: string): IWriteRepository<T>;
}
