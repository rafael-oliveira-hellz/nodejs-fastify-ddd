import Memcached from 'memcached';
import { ICacheService } from '../interfaces/ICacheInterface';

export class MemcachedService implements ICacheService {
  private client: Memcached;

  /**
   * Constructor for initializing the MemcachedService.
   *
   * @param {string} uri - The URI to connect to the Memcached server.
   */
  constructor(private uri: string) {
    this.client = new Memcached(this.uri);
  }

  /**
   * Sets a key-value pair in the cache with a specified time-to-live.
   *
   * @param {string} key - The key to set in the cache.
   * @param {string} value - The value to associate with the key.
   * @param {number} ttl - The time-to-live for the key-value pair in seconds.
   * @return {Promise<void>} A Promise that resolves once the key-value pair is set in the cache.
   */
  set(key: string, value: string, ttl: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, ttl, (err) => {
        if (err) reject(new Error(err.message || 'Unknown error occurred'));
        else resolve();
      });
    });
  }

  /**
   * Retrieves a value from the cache based on the provided key.
   *
   * @param {string} key - The key to retrieve the value from the cache.
   * @return {Promise<string | null>} A Promise that resolves with the retrieved value or null if not found.
   */
  get(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, data) => {
        if (err) reject(new Error(err.message || 'Unknown error occurred'));
        else resolve(data as string | null);
      });
    });
  }

  /**
   * Deletes the specified key from the cache.
   *
   * @param {string} key - The key to delete from the cache.
   * @return {Promise<void>} A Promise that resolves once the key is deleted.
   */
  del(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, _response) => {
        if (err) reject(new Error(err.message || 'Unknown error occurred'));
        else resolve();
      });
    });
  }
}
