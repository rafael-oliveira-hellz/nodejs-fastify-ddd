// src/infrastructure/factories/DatabaseConnectionFactory.ts

import { MongoDBConnection } from "../database/mongodb/MongoDBConnection";

export class DatabaseConnectionFactory {
  private static commandCreators: Map<string, () => MongoDBConnection> =
    new Map();
  private static queryCreators: Map<string, () => MongoDBConnection> =
    new Map();

  static registerCommandConnectionType(
    type: string,
    creator: () => MongoDBConnection
  ): void {
    this.commandCreators.set(type, creator);
  }

  static registerQueryConnectionType(
    type: string,
    creator: () => MongoDBConnection
  ): void {
    this.queryCreators.set(type, creator);
  }

  static getCommandConnection(type: string): MongoDBConnection {
    if (!this.commandCreators.has(type)) {
      throw new Error(
        `No command connection creator registered for type: ${type}`
      );
    }
    return this.commandCreators.get(type)!();
  }

  static getQueryConnection(type: string): MongoDBConnection {
    if (!this.queryCreators.has(type)) {
      throw new Error(
        `No query connection creator registered for type: ${type}`
      );
    }
    return this.queryCreators.get(type)!();
  }
}
