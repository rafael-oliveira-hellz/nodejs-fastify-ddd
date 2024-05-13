import { IReadRepository } from "../../infrastructure/database/interfaces/IReadRepository";
import { IWriteRepository } from "../../infrastructure/database/interfaces/IWriteRepository";
import { User } from "../entities/User";

export interface IUserWriteRepository extends IWriteRepository<User> {}
export interface IUserReadRepository extends IReadRepository<User> {}
