// RedisCacheService.ts
import { RedisClientType, createClient } from "redis";
import { ICacheService } from "../interfaces/ICacheInterface";

export class RedisCacheService implements ICacheService {
  private client: RedisClientType;

  constructor(private uri: string) {
    this.client = createClient({ url: uri });
    this.client.connect();
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.client.set(key, value, { EX: ttl });
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
