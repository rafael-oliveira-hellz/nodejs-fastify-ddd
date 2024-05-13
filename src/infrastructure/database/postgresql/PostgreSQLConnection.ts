import { Pool } from "pg";
import { IReadDatabaseConnection } from "../interfaces/IReadDatabaseConnection";

export class PostgreSQLConnection implements IReadDatabaseConnection {
  private pool: Pool;

  constructor(private connectionString: string) {
    this.pool = new Pool({ connectionString: this.connectionString });
  }
  findById<T>(
    tableOrCollection: string,
    id: string | number
  ): Promise<T | null> {
    throw new Error("Method not implemented.");
  }
  findOne<T>(
    tableOrCollection: string,
    criteria: Partial<T>
  ): Promise<T | null> {
    throw new Error("Method not implemented.");
  }
  findAll<T>(tableOrCollection: string, criteria: Partial<T>): Promise<T[]> {
    throw new Error("Method not implemented.");
  }

  async connect(): Promise<void> {
    await this.pool.connect();
    console.log("Connected to PostgreSQL");
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
    console.log("Disconnected from PostgreSQL");
  }
}
