// src/infrastructure/factories/ConcreteRepositoryFactory.ts

import { IDiContainer } from "../../shared/DIContainer";
import { GenericRepository } from "../database/GenericRepository";
import {
  IReadRepository,
  IWriteRepository,
} from "../database/interfaces/IRepository";
import { ITransactional } from "../database/interfaces/ITransactional";
import { IRepositoryFactory } from "./interfaces/IRepositoryFactory";

export class ConcreteRepositoryFactory implements IRepositoryFactory {
  constructor(private diContainer: IDiContainer) {}

  createRepository<T>(
    collectionName: string,
    connectionKey: string = "DatabaseConnection"
  ): GenericRepository<T> {
    const dbConnection = this.diContainer.resolve<
      ITransactional & IReadRepository<T> & IWriteRepository<T>
    >(connectionKey);
    if (!dbConnection) {
      throw new Error(
        `Database connection '${connectionKey}' could not be resolved.`
      );
    }

    return new GenericRepository<T>(dbConnection, collectionName);
  }
}
