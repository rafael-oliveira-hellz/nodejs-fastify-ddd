// src/infrastructure/database/interfaces/IDatabaseTypes.ts

import { IReadRepository, IWriteRepository } from "./IRepository";
import { ITransactional } from "./ITransactional";

export type CommandConnectionType<T> = ITransactional & IWriteRepository<T>;
export type QueryConnectionType<T> = IReadRepository<T>;
