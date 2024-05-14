// src/domain/contracts/IUserQueryRepository.ts

import { User } from "../entities/User";

export interface IUserQueryRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
