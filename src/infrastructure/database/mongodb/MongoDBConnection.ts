import {
  ClientSession,
  Db,
  Document,
  InsertOneResult,
  MongoClient,
  ObjectId,
} from 'mongodb';
import { IReadDatabaseConnection } from '../interfaces/IReadDatabaseConnection';
import { ITransactional } from '../interfaces/ITransactional';
import { IWriteDatabaseConnection } from '../interfaces/IWriteDatabaseConnection';

export class MongoDBConnection
  implements IReadDatabaseConnection, IWriteDatabaseConnection, ITransactional
{
  private client: MongoClient;
  private db: Db | null = null;
  private session?: ClientSession;
  private _isConnected: boolean = false;

  /**
   *
   * @param {string} uri - private uri parameter
   */
  constructor(private uri: string) {
    this.client = new MongoClient(this.uri);
  }

  /**
   * Check if the connection is established.
   *
   * @return {boolean} the connection status
   */
  isConnected(): boolean {
    return this._isConnected;
  }

  /**
   * Connects to the MongoDB database if not already connected.
   *
   * @return {Promise<void>} Promise that resolves once the connection is established.
   */
  async connect(): Promise<void> {
    if (!this.isConnected()) {
      try {
        await this.client.connect();
        this.db = this.client.db();
        this._isConnected = true;
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      }
    }
  }

  /**
   * Disconnects from the MongoDB database if the connection is established.
   *
   * @return {Promise<void>} Promise that resolves once the disconnection is completed.
   */
  async disconnect(): Promise<void> {
    if (this.isConnected()) {
      try {
        await this.client.close();
        this._isConnected = false;
        console.log('Disconnected from MongoDB');
      } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        throw error;
      }
    }
  }

  /**
   * Initiates a transaction by connecting, starting a session, and beginning the transaction.
   *
   * @return {Promise<void>}
   */
  async beginTransaction(): Promise<void> {
    await this.connect();
    this.session = this.client.startSession();
    this.session.startTransaction();
    console.log('Transaction started');
  }

  /**
   * Commits the current transaction if a session exists.
   *
   * @return {Promise<void>}
   */
  async commit(): Promise<void> {
    if (this.session) {
      await this.session.commitTransaction();
      console.log('Transaction committed');
    }
  }

  /**
   * A method to rollback a transaction.
   *
   * @return {Promise<void>} No return value.
   */
  async rollback(): Promise<void> {
    try {
      if (this.session) {
        await this.session.abortTransaction();
        console.log('Transaction rolled back');
      }
    } finally {
      this.session?.endSession();
    }
  }

  /**
   * A description of the entire function.
   *
   * @param {string} tableOrCollection - description of parameter
   * @param {string | number} id - description of parameter
   * @return {Promise<T | null>} description of return value
   */
  async findById<T>(
    tableOrCollection: string,
    id: string | number,
  ): Promise<T | null> {
    await this.connect();
    const doc = await this.db!.collection(tableOrCollection).findOne({
      _id: new ObjectId(id.toString()),
    });
    if (!doc) return null;
    return doc as T;
  }

  /**
   * A description of the entire function.
   *
   * @param {string} tableOrCollection - description of parameter
   * @param {Partial<T>} criteria - description of parameter
   * @return {Promise<T | null>} description of return value
   */
  async findOne<T>(
    tableOrCollection: string,
    criteria: Partial<T>,
  ): Promise<T | null> {
    await this.connect();

    const result = await this.db!.collection(tableOrCollection).findOne(
      criteria,
      {
        projection: {
          _id: 0,
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    );
    return result as T;
  }

  /**
   * A description of the entire function.
   *
   * @param {string} tableOrCollection - description of parameter
   * @param {Partial<T>} criteria - description of parameter
   * @return {Promise<T[]>} description of return value
   */
  async findAll<T>(
    tableOrCollection: string,
    criteria: Partial<T>,
  ): Promise<T[]> {
    await this.connect();

    const results = await this.db!.collection(tableOrCollection)
      .find(criteria)
      .toArray();
    return results as T[];
  }

  /**
   * Create a new entity in the specified table or collection.
   *
   * @param {string} tableOrCollection - the name of the table or collection
   * @param {Partial<T>} entity - the entity to be created
   * @return {Promise<T>} the newly created entity
   */
  async create<T>(
    tableOrCollection: string,
    entity: Partial<T & { id?: string }>,
  ): Promise<T> {
    await this.connect();

    const entityToInsert = { ...entity };

    if (entityToInsert.id) {
      delete entityToInsert.id;
    }

    const result: InsertOneResult<Document> =
      await this.db!.collection(tableOrCollection).insertOne(entityToInsert);

    return { ...entity, id: result.insertedId.toString() } as T;
  }

  /**
   * Update a record in the database table or collection.
   *
   * @param {string} tableOrCollection - the name of the table or collection
   * @param {string | number} id - the id of the record to update
   * @param {Partial<T>} entity - the partial entity object with updated values
   * @return {Promise<void>} a promise that resolves when the update is completed
   */
  async update<T>(
    tableOrCollection: string,
    id: string | number,
    entity: Partial<T>,
    options?: object,
  ): Promise<void> {
    await this.connect();
    const updateData = { $set: entity };
    await this.db!.collection(tableOrCollection).updateOne(
      { _id: new ObjectId(id.toString()) },
      updateData,
      options,
    );
  }

  /**
   * A description of the entire function.
   *
   * @param {string} tableOrCollection - the name of the table or collection
   * @param {string | number} id - the id of the record to delete
   * @return {Promise<void>} a promise that resolves when the deletion is completed
   */
  async delete(tableOrCollection: string, id: string | number): Promise<void> {
    await this.connect();
    await this.db!.collection(tableOrCollection).deleteOne({
      _id: new ObjectId(id.toString()),
    });
  }
}
