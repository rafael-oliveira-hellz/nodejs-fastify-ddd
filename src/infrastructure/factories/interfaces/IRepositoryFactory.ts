import { GenericCommandRepository } from '../../../infrastructure/database/GenericCommandRepository';
import { GenericQueryRepository } from '../../../infrastructure/database/GenericQueryRepository';

export interface IRepositoryFactory {
  createCommandRepository<T>(
    tableOrCollection: string,
  ): GenericCommandRepository<T>;

  createQueryRepository<T>(
    tableOrCollection: string,
  ): GenericQueryRepository<T>;
}
