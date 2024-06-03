import { IWriteRepository } from './IRepository';

export interface ICommandRepository<T> extends IWriteRepository<T> {}
