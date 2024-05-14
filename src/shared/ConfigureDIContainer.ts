import { MongoDBConnection } from "../infrastructure/database/mongodb/MongoDBConnection";
import { ConcreteRepositoryFactory } from "../infrastructure/factories/RepositoryFactory";
import DIContainer from "./DIContainer";

/**
 * Configures the dependency injection container by registering database connections and a repository factory.
 *
 * @return {Promise<void>} A promise that resolves when the container is configured.
 */
export async function configureDIContainer(): Promise<void> {
  const dbWrite = new MongoDBConnection(process.env.MONGO_WRITE_URI ?? "");
  const dbRead = new MongoDBConnection(process.env.MONGO_READ_URI ?? "");
  const repositoryFactory = new ConcreteRepositoryFactory(DIContainer);

  DIContainer.register("DatabaseConnectionWrite", () => dbWrite);
  DIContainer.register("DatabaseConnectionRead", () => dbRead);
  DIContainer.register("RepositoryFactory", () => repositoryFactory);
}
