import { ICacheService } from '../caching/interfaces/ICacheInterface';
import { RedisCacheService } from '../caching/redis/RedisCacheService';
import { ICacheFactory } from './interfaces/ICacheFactory';

export class RedisCacheFactory implements ICacheFactory {
  /**
   * Creates and returns a new instance of RedisCacheService as the cache service.
   *
   * @return {ICacheService} The created RedisCacheService instance.
   */
  createCacheService(): ICacheService {
    return new RedisCacheService();
  }
}
