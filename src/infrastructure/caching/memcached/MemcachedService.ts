import Memcached from "memcached";
import { ICacheService } from "../interfaces/ICacheInterface";

export class MemcachedService implements ICacheService {
  private client: Memcached;

  constructor(private uri: string) {
    this.client = new Memcached(uri);
  }

  set(key: string, value: string, ttl: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, ttl, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  get(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, data) => {
        if (err) reject(err);
        else resolve(data as string | null);
      });
    });
  }

  del(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, response) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
