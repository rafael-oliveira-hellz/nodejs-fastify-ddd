import { ICacheService } from '../interfaces/ICacheInterface';

export class InMemoryCache implements ICacheService {
  private store: Record<string, { value: string; expires: number }> = {};

  /**
   * Sets a key-value pair in the cache with a specified time-to-live.
   *
   * @param {string} key - The key to set in the cache.
   * @param {string} value - The value to associate with the key.
   * @param {number} ttl - The time-to-live for the key-value pair in seconds.
   * @return {Promise<void>} A Promise that resolves once the key-value pair is set in the cache.
   */
  async set(key: string, value: string, ttl: number): Promise<void> {
    const expires = Date.now() + ttl * 1000;
    this.store[key] = { value, expires };
  }

  /**
   * Retrieves the value associated with the specified key from the cache.
   *
   * @param {string} key - The key for retrieving the value.
   * @return {Promise<string | null>} A Promise that resolves with the value corresponding to the key, or null if the key is not found.
   */
  async get(key: string): Promise<string | null> {
    const item = this.store[key];
    if (item) {
      if (item.expires < Date.now()) {
        delete this.store[key];
        return null;
      }
      return item.value;
    }
    return null;
  }

  /**
   * Deletes the value associated with the specified key from the cache.
   *
   * @param {string} key - The key for deleting the value.
   * @return {Promise<void>} A Promise that resolves once the value is deleted from the cache.
   */
  async del(key: string): Promise<void> {
    delete this.store[key];
  }
}
