import { IDiContainer } from '../../shared/DIContainer';
import { ICacheFactory } from '../factories/interfaces/ICacheFactory';
import { ICacheService } from './interfaces/ICacheInterface';

export class GenericCacheServiceFactory {
  constructor(private diContainer: IDiContainer) {}

  /**
   * A function that creates a cache service based on the provided type.
   *
   * @param {string} type - The type of cache service to create.
   * @return {ICacheService} The created cache service.
   */
  createCacheService(type: string): ICacheService {
    const cacheServiceFactory = this.diContainer.resolve<ICacheFactory>(
      `${type}CacheServiceFactory`,
    );
    if (!cacheServiceFactory) {
      throw new Error(`Cache service factory not found: ${type}`);
    }
    return cacheServiceFactory.createCacheService();
  }
}
