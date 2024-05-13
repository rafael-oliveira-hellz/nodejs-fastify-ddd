import { InMemoryCache } from "../caching/in-memory/InMemoryCache";
import { ICacheService } from "../caching/interfaces/ICacheInterface";
import { ICacheFactory } from "./interfaces/ICacheFactory";

export class InMemoryCacheFactory implements ICacheFactory {
  createCacheService(): ICacheService {
    return new InMemoryCache();
  }
}
