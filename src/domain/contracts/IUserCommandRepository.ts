// src/domain/contracts/IUserCommandRepository.ts
import { User } from "../entities/User";

export interface IUserCommandRepository {
  create(user: User): Promise<void>;
  update(id: string, user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
