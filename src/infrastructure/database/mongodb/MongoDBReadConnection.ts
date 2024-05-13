import { Db, MongoClient, ObjectId } from "mongodb";
import { IReadDatabaseConnection } from "../interfaces/IReadDatabaseConnection";

export type MongoDBCriteria = Record<string, unknown>;

export class MongoDBReadConnection implements IReadDatabaseConnection {
  private db: Db | null = null;

  constructor(private uri: string) {
    this.connect();
  }

  private async connect() {
    const client = new MongoClient(this.uri);
    try {
      await client.connect();
      this.db = client.db();
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  async findById<T>(
    tableOrCollection: string,
    id: string | number
  ): Promise<T | null> {
    await this.ensureConnected();

    const doc = await this.db!.collection(tableOrCollection).findOne({
      _id: new ObjectId(id.toString()),
    });

    if (!doc) return null;

    const { _id, ...data } = doc;
    return data as T;
  }

  async findOne<T>(
    tableOrCollection: string,
    criteria: Partial<T>
  ): Promise<T | null> {
    await this.ensureConnected();

    const result = await this.db!.collection(tableOrCollection).findOne(
      criteria
    );

    if (result) {
      return result as T;
    }

    return null;
  }

  async findAll<T>(
    tableOrCollection: string,
    criteria: Partial<T>
  ): Promise<T[]> {
    await this.ensureConnected();

    const results = await this.db!.collection(tableOrCollection)
      .find(criteria)
      .toArray();
    return results as T[];
  }

  private async ensureConnected() {
    if (!this.db) {
      throw new Error("Database not connected");
    }
  }
}
