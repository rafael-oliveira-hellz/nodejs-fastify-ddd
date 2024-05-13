import { IUserWriteRepository } from "../domain/contracts/IUserRepository";
import { UserRepository } from "../infrastructure/database/repositories/UserRepository";
import { DatabaseConnectionFactory } from "../infrastructure/factories/DatabaseConnectionFactory";
import { InMemoryCacheFactory } from "../infrastructure/factories/InMemoryCacheFactory";
import { RabbitMQBrokerFactory } from "../infrastructure/factories/RabbitMQBrokerFactory";
import { RedisCacheFactory } from "../infrastructure/factories/RedisCacheFactory";
import { ConcreteRepositoryFactory } from "../infrastructure/factories/RepositoryFactory";
import DIContainer from "./DIContainer";

export function configureDIContainer() {
  const readDbConnection =
    DatabaseConnectionFactory.createReadConnection("MongoDB");
  const writeDbConnection =
    DatabaseConnectionFactory.createWriteConnection("MongoDB");

  DIContainer.register("IReadDatabaseConnection", readDbConnection);
  DIContainer.register("IWriteDatabaseConnection", writeDbConnection);

  DIContainer.register("IRepositoryFactory", new ConcreteRepositoryFactory());
  DIContainer.register<IUserWriteRepository>(
    "IUserWriteRepository",
    new UserRepository(writeDbConnection)
  );

  const inMemoryCacheFactory = new InMemoryCacheFactory();
  DIContainer.register(
    "ICacheService",
    inMemoryCacheFactory.createCacheService()
  );

  const cacheFactory = new RedisCacheFactory();
  DIContainer.register("ICacheService", cacheFactory.createCacheService());

  const messageBrokerFactory = new RabbitMQBrokerFactory();
  DIContainer.register(
    "IMessageBroker",
    messageBrokerFactory.createMessageBroker()
  );
}
