// src/infrastructure/database/GenericRepository.ts

import { IReadRepository, IWriteRepository } from "./interfaces/IRepository";
import { ITransactional } from "./interfaces/ITransactional";

export class GenericRepository<T> {
  constructor(
    private dbConnection: ITransactional &
      IReadRepository<T> &
      IWriteRepository<T>,
    private collectionName: string // This parameter should already be here as per previous setup
  ) {}

  async create(entity: T): Promise<void> {
    // Use the collection name provided during the instantiation of the repository
    await this.dbConnection.create(this.collectionName, entity);
  }

  // Adjust other methods similarly
  async update(id: string | number, entity: Partial<T>): Promise<void> {
    await this.dbConnection.update(this.collectionName, id, entity);
  }

  async delete(id: string | number): Promise<void> {
    await this.dbConnection.delete(this.collectionName, id);
  }

  async findById(id: string | number): Promise<T | null> {
    return this.dbConnection.findById(this.collectionName, id);
  }

  async findAll(criteria: Partial<T>): Promise<T[]> {
    return this.dbConnection.findAll(this.collectionName, criteria);
  }
}
