import { IDiContainer } from '../../shared/DIContainer';
import { GenericCommandRepository } from '../database/GenericCommandRepository';
import { GenericQueryRepository } from '../database/GenericQueryRepository';
import { ICommandRepository } from '../database/interfaces/ICommandRepository';
import { IQueryRepository } from '../database/interfaces/IQueryRepository';
import { ITransactional } from '../database/interfaces/ITransactional';
import { IRepositoryFactory } from './interfaces/IRepositoryFactory';

export class ConcreteRepositoryFactory implements IRepositoryFactory {
  constructor(private diContainer: IDiContainer) {}

  createCommandRepository<T>(
    tableOrCollectionName: string,
    connectionKey: string = 'DatabaseConnectionWrite',
  ): GenericCommandRepository<T> {
    const dbConnection = this.diContainer.resolve<
      ITransactional & ICommandRepository<T>
    >(connectionKey);
    if (!dbConnection) {
      throw new Error(
        `Database connection '${connectionKey}' could not be resolved.`,
      );
    }

    return new GenericCommandRepository<T>(dbConnection, tableOrCollectionName);
  }

  createQueryRepository<T>(
    tableOrCollectionName: string,
    connectionKey: string = 'DatabaseConnectionRead',
  ): GenericQueryRepository<T> {
    const dbConnection = this.diContainer.resolve<
      ITransactional & IQueryRepository<T>
    >(connectionKey);
    if (!dbConnection) {
      throw new Error(
        `Database connection '${connectionKey}' could not be resolved.`,
      );
    }

    return new GenericQueryRepository<T>(dbConnection, tableOrCollectionName);
  }
}
