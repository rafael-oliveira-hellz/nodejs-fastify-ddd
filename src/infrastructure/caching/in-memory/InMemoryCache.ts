import { ICacheService } from "../interfaces/ICacheInterface";

export class InMemoryCache implements ICacheService {
  private store: Record<string, { value: string; expires: number }> = {};

  async set(key: string, value: string, ttl: number): Promise<void> {
    const expires = Date.now() + ttl * 1000; // Convert ttl to milliseconds
    this.store[key] = { value, expires };
  }

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

  async del(key: string): Promise<void> {
    delete this.store[key];
  }
}
