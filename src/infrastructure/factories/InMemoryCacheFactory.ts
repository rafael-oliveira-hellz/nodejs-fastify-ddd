import { InMemoryCache } from '../caching/in-memory/InMemoryCache';
import { ICacheService } from '../caching/interfaces/ICacheInterface';
import { ICacheFactory } from './interfaces/ICacheFactory';

export class InMemoryCacheFactory implements ICacheFactory {
  /**
   * Creates and returns a new instance of the cache service.
   *
   * @return {ICacheService} The created cache service instance.
   */
  createCacheService(): ICacheService {
    return new InMemoryCache();
  }
}
