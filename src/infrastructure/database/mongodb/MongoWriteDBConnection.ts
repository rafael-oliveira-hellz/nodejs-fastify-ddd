import { ClientSession, Db, MongoClient, ObjectId } from "mongodb";
import { IWriteDatabaseConnection } from "../interfaces/IWriteDatabaseConnection";

export class MongoDBWriteConnection implements IWriteDatabaseConnection {
  private client: MongoClient;
  private session?: ClientSession;
  private db: Db | null = null;
  private isConnected: boolean = false;

  constructor(private uri: string) {
    this.client = new MongoClient(this.uri);
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.client.connect();
        this.db = this.client.db();
        this.isConnected = true;
        console.log("Connected to MongoDB");
      } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.client.close();
        this.isConnected = false;
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
    try {
      if (this.session) {
        await this.session.commitTransaction();
        console.log("Transaction committed");
      }
    } catch (error) {
      console.error("Failed to commit transaction:", error);
      throw error;
    } finally {
      this.session?.endSession();
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

  async create<T>(
    tableOrCollection: string,
    entity: Partial<T>
  ): Promise<void> {
    await this.connect();
    if (this.db) {
      await this.db.collection(tableOrCollection).insertOne(entity);
    } else {
      throw new Error("Database connection not established");
    }
  }

  async update<T>(
    tableOrCollection: string,
    id: string | number,
    entity: Partial<T>
  ): Promise<void> {
    await this.connect();
    if (this.db) {
      const collection = this.db.collection(tableOrCollection);
      const mongoUpdates: Partial<T> = {};

      for (const key in entity) {
        if (entity.hasOwnProperty(key)) {
          mongoUpdates[key] = entity[key];
        }
      }

      await collection.updateOne(
        { _id: new ObjectId(id.toString()) },
        { $set: mongoUpdates }
      );
      console.log("Order updated in Command DB");
    } else {
      throw new Error("Database connection not established");
    }
  }

  async delete<T>(
    tableOrCollection: string,
    id: string | number
  ): Promise<void> {
    await this.connect();
    if (this.db) {
      await this.db
        .collection(tableOrCollection)
        .deleteOne({ _id: new ObjectId(id.toString()) });
      console.log("Order deleted from Command DB");
    } else {
      throw new Error("Database connection not established");
    }
  }
}
