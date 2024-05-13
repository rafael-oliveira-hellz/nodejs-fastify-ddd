import { ICacheService } from "../caching/interfaces/ICacheInterface";
import { RedisCacheService } from "../caching/redis/RedisCacheService";
import { ICacheFactory } from "./interfaces/ICacheFactory";

export class RedisCacheFactory implements ICacheFactory {
  createCacheService(): ICacheService {
    return new RedisCacheService(process.env.REDIS_URI || "");
  }
}
