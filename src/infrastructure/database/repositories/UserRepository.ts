import { IUserWriteRepository } from "../../../domain/contracts/IUserRepository";
import { User } from "../../../domain/entities/User";
import { ITransactional } from "../interfaces/ITransactional";
import { IWriteDatabaseConnection } from "../interfaces/IWriteDatabaseConnection";

export class UserRepository implements IUserWriteRepository, ITransactional {
  constructor(private dbConnection: IWriteDatabaseConnection) {}

  async beginTransaction(): Promise<void> {
    await this.dbConnection.beginTransaction();
  }

  async commit(): Promise<void> {
    await this.dbConnection.commit();
  }

  async rollback(): Promise<void> {
    await this.dbConnection.rollback();
  }

  async update(id: string | number, entity: Partial<User>): Promise<void> {
    const collectionName = "users";

    try {
      await this.dbConnection.update<User>(collectionName, id, entity);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to update user: ${error.message}`);
      }
    }
  }
  async delete(id: string | number): Promise<void> {
    const collectionName = "users";

    try {
      await this.dbConnection.delete<User>(collectionName, id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete user: ${error.message}`);
      }
    }
  }

  async create(user: User): Promise<void> {
    const collectionName = "users";

    try {
      await this.dbConnection.create<User>(collectionName, user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create user: ${error.message}`);
      }
    }
  }
}
