import { IReadDatabaseConnection } from "../database/interfaces/IReadDatabaseConnection";
import { IWriteDatabaseConnection } from "../database/interfaces/IWriteDatabaseConnection";
import { MongoDBReadConnection } from "../database/mongodb/MongoDBReadConnection";
import { MongoDBWriteConnection } from "../database/mongodb/MongoWriteDBConnection";

// src/infrastructure/factories/DatabaseConnectionFactory.ts

export class DatabaseConnectionFactory {
  private static readConnection: IReadDatabaseConnection | null = null;
  private static writeConnection: IWriteDatabaseConnection | null = null;

  static createReadConnection(type: string): IReadDatabaseConnection {
    if (!this.readConnection) {
      if (type === "MongoDB") {
        this.readConnection = new MongoDBReadConnection(
          process.env.MONGO_READ_URI ?? ""
        );
      } else {
        throw new Error(`Unknown read database type: ${type}`);
      }
    }

    return this.readConnection;
  }

  static createWriteConnection(type: string): IWriteDatabaseConnection {
    if (!this.writeConnection) {
      if (type === "MongoDB") {
        this.writeConnection = new MongoDBWriteConnection(
          process.env.MONGO_WRITE_URI ?? ""
        );
      } else {
        throw new Error(`Unknown write database type: ${type}`);
      }
    }
    return this.writeConnection;
  }
}
