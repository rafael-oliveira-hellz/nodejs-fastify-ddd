// src/infrastructure/repositories/UserCommandRepository.ts

import { IUserCommandRepository } from "../../../domain/contracts/IUserCommandRepository";
import { User } from "../../../domain/entities/User";
import { CommandConnectionType } from "../interfaces/IDatabaseTypes";

export class UserCommandRepository implements IUserCommandRepository {
  private collectionName: string;

  constructor(
    private dbConnection: CommandConnectionType<User>,
    collectionName: string
  ) {
    this.collectionName = collectionName;
  }

  async create(user: User): Promise<void> {
    await this.dbConnection.beginTransaction();
    try {
      await this.dbConnection.create(this.collectionName, user);
      await this.dbConnection.commit();
    } catch (error) {
      await this.dbConnection.rollback();
      throw error;
    }
  }

  async update(id: string, user: User): Promise<void> {
    await this.dbConnection.beginTransaction();
    try {
      await this.dbConnection.update(this.collectionName, id, user);
      await this.dbConnection.commit();
    } catch (error) {
      await this.dbConnection.rollback();
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await this.dbConnection.beginTransaction();
    try {
      await this.dbConnection.delete(this.collectionName, id);
      await this.dbConnection.commit();
    } catch (error) {
      await this.dbConnection.rollback();
      throw error;
    }
  }
}
