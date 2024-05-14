// src/infrastructure/repositories/UserQueryRepository.ts

import { IUserQueryRepository } from "../../../domain/contracts/IUserQueryRepository";
import { User } from "../../../domain/entities/User";
import { QueryConnectionType } from "../interfaces/IDatabaseTypes";

export class UserQueryRepository implements IUserQueryRepository {
  private collectionName: string;

  constructor(
    private dbConnection: QueryConnectionType<User>,
    collectionName: string
  ) {
    this.collectionName = collectionName;
  }

  async findById(id: string): Promise<User | null> {
    return this.dbConnection.findById(this.collectionName, id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.dbConnection.findOne(this.collectionName, { username });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.dbConnection.findOne(this.collectionName, { email });
  }

  async findAll(): Promise<User[]> {
    return this.dbConnection.findAll(this.collectionName, {});
  }
}
