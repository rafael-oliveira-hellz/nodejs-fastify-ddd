import { GenericCacheServiceFactory } from '../infrastructure/caching/GenericCacheServiceFactory';
import { MongoDBConnection } from '../infrastructure/database/mongodb/MongoDBConnection';
import { InMemoryCacheFactory } from '../infrastructure/factories/InMemoryCacheFactory';
import { RedisCacheFactory } from '../infrastructure/factories/RedisCacheFactory';
import { ConcreteRepositoryFactory } from '../infrastructure/factories/RepositoryFactory';
import { GenericBrokerFactory } from '../infrastructure/messaging/GenericBrokerFactory';
import { RabbitMQBrokerFactory } from '../infrastructure/messaging/amqp/RabbitMQBrokerFactory';
import DIContainer from './DIContainer';

/**
 * Registers database connections in the DI container.
 */
function registerMongoDatabaseConnections(): void {
  const dbWrite = new MongoDBConnection(process.env.MONGO_WRITE_URI ?? '');
  const dbRead = new MongoDBConnection(process.env.MONGO_READ_URI ?? '');

  DIContainer.register('DatabaseConnectionWrite', () => dbWrite);
  DIContainer.register('DatabaseConnectionRead', () => dbRead);
}

/**
 * Registers the repository factory in the DI container.
 */
function registerRepositoryFactory(): void {
  const repositoryFactory = new ConcreteRepositoryFactory(DIContainer);
  DIContainer.register('RepositoryFactory', () => repositoryFactory);
}

/**
 * Registers message brokers in the DI container.
 */
function registerMessageBrokers(): void {
  DIContainer.register(
    'RabbitMQBrokerFactory',
    () => new RabbitMQBrokerFactory(),
  );
  DIContainer.register(
    'MessageBrokerFactory',
    () => new GenericBrokerFactory(DIContainer),
  );
}

/**
 * Registers cache services in the DI container.
 */
function registerCacheServices(): void {
  DIContainer.register(
    'RedisCacheServiceFactory',
    () => new RedisCacheFactory(),
  );
  DIContainer.register(
    'InMemoryCacheServiceFactory',
    () => new InMemoryCacheFactory(),
  );
  DIContainer.register(
    'GenericCacheServiceFactory',
    () => new GenericCacheServiceFactory(DIContainer),
  );
}

/**
 * Configures the dependency injection container by registering database connections and a repository factory.
 *
 * @return {Promise<void>} A promise that resolves when the container is configured.
 */
export async function configureDIContainer(): Promise<void> {
  registerMongoDatabaseConnections();
  registerRepositoryFactory();
  registerMessageBrokers();
  registerCacheServices();
}
