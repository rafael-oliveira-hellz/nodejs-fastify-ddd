import { ICacheService } from '../../caching/interfaces/ICacheInterface';

export interface ICacheFactory {
  createCacheService(): ICacheService;
}
