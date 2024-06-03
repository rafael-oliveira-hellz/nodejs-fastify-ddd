import { RedisClientType, createClient } from 'redis';
import { ICacheService } from '../interfaces/ICacheInterface';

export class RedisCacheService implements ICacheService {
  private client: RedisClientType;

  /**
   * Constructor for initializing the RedisCacheService.
   *
   * @param {} - No parameters
   * @return {} - No return value
   */
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
          ? parseInt(process.env.REDIS_PORT)
          : undefined,
      },
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    });

    this.client.connect();
  }

  /**
   * Sets a key-value pair in the cache with an expiration time.
   *
   * @param {string} key - The key to set in the cache.
   * @param {string} value - The value to associate with the key.
   * @param {number} ttl - The time-to-live for the key-value pair in seconds.
   * @return {Promise<void>} A Promise that resolves once the key-value pair is set in the cache.
   */
  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.client.set(key, value, { EX: ttl });
  }

  /**
   * Retrieves the value associated with the specified key from the cache.
   *
   * @param {string} key - The key for retrieving the value.
   * @return {Promise<string | null>} A Promise that resolves with the value corresponding to the key, or null if the key is not found.
   */
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  /**
   * Deletes the value associated with the specified key from the cache.
   *
   * @param {string} key - The key for deleting the value.
   * @return {Promise<void>} A Promise that resolves once the value is deleted from the cache.
   */
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
