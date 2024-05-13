import DIContainer from "../../shared/DIContainer";
import { ReadRepository } from "../database/ReadRepository";
import { WriteRepository } from "../database/WriteRepository";
import { IReadDatabaseConnection } from "../database/interfaces/IReadDatabaseConnection";
import { IReadRepository } from "../database/interfaces/IReadRepository";
import { IWriteDatabaseConnection } from "../database/interfaces/IWriteDatabaseConnection";
import { IWriteRepository } from "../database/interfaces/IWriteRepository";
import { IRepositoryFactory } from "./interfaces/IRepositoryFactory";

export class ConcreteRepositoryFactory implements IRepositoryFactory {
  createReadRepository<T>(tableOrCollection: string): IReadRepository<T> {
    const readDb = DIContainer.resolve<IReadDatabaseConnection>(
      "IReadDatabaseConnection"
    );
    return new ReadRepository<T>(readDb, tableOrCollection);
  }

  createWriteRepository<T>(tableOrCollection: string): IWriteRepository<T> {
    const writeDb = DIContainer.resolve<IWriteDatabaseConnection>(
      "IWriteDatabaseConnection"
    );
    return new WriteRepository<T>(writeDb, tableOrCollection);
  }
}
