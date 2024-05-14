// src\infrastructure\database\mongodb\MongoDBConnection.ts

import { ClientSession, Db, MongoClient, ObjectId, OptionalId } from "mongodb";
import { IReadDatabaseConnection } from "../interfaces/IReadDatabaseConnection";
import { ITransactional } from "../interfaces/ITransactional";
import { IWriteDatabaseConnection } from "../interfaces/IWriteDatabaseConnection";

export class MongoDBConnection
  implements IReadDatabaseConnection, IWriteDatabaseConnection, ITransactional
{
  private client: MongoClient;
  private db: Db | null = null;
  private session?: ClientSession;
  private _isConnected: boolean = false;

  constructor(private uri: string) {
    this.client = new MongoClient(this.uri);
  }

  isConnected(): boolean {
    return this._isConnected;
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.client.connect();
        this.db = this.client.db();
        this._isConnected = true;
        console.log("Connected to MongoDB");
      } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this._isConnected) {
      try {
        await this.client.close();
        this._isConnected = false;
        console.log("Disconnected from MongoDB");
      } catch (error) {
        console.error("Error disconnecting from MongoDB:", error);
        throw error;
      }
    }
  }

  async beginTransaction(): Promise<void> {
    await this.connect();
    this.session = this.client.startSession();
    this.session.startTransaction();
    console.log("Transaction started");
  }

  async commit(): Promise<void> {
    if (this.session) {
      await this.session.commitTransaction();
      console.log("Transaction committed");
    }
  }

  async rollback(): Promise<void> {
    try {
      if (this.session) {
        await this.session.abortTransaction();
        console.log("Transaction rolled back");
      }
    } finally {
      this.session?.endSession();
    }
  }

  // Read methods
  async findById<T>(
    tableOrCollection: string,
    id: string | number
  ): Promise<T | null> {
    await this.ensureConnected();
    const doc = await this.db!.collection(tableOrCollection).findOne({
      _id: new ObjectId(id.toString()),
    });
    if (!doc) return null;
    return doc as T;
  }

  async findOne<T>(
    tableOrCollection: string,
    criteria: Partial<T>
  ): Promise<T | null> {
    await this.ensureConnected();
    const result = await this.db!.collection(tableOrCollection).findOne(
      criteria
    );
    return result as T;
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

  async create<T>(tableOrCollection: string, entity: T): Promise<void> {
    await this.connect();
    await this.db!.collection(tableOrCollection).insertOne(
      entity as OptionalId<Document>
    );
  }

  async update<T>(
    tableOrCollection: string,
    id: string | number,
    entity: Partial<T>
  ): Promise<void> {
    await this.connect();
    const updateData = { $set: entity };
    await this.db!.collection(tableOrCollection).updateOne(
      { _id: new ObjectId(id.toString()) },
      updateData
    );
  }

  async delete<T>(
    tableOrCollection: string,
    id: string | number
  ): Promise<void> {
    await this.connect();
    await this.db!.collection(tableOrCollection).deleteOne({
      _id: new ObjectId(id.toString()),
    });
  }

  private async ensureConnected() {
    if (!this.db) {
      throw new Error("Database not connected");
    }
  }
}
