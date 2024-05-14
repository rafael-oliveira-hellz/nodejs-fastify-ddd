import {
  IReadRepository,
  IWriteRepository,
} from "../../infrastructure/database/interfaces/IRepository";
import { User } from "../entities/User";

export interface IUserRepository
  extends IReadRepository<User>,
    IWriteRepository<User> {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
