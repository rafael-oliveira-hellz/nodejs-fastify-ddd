import { GenericCommandRepository } from '../../../infrastructure/database/GenericCommandRepository';

export interface ICommandHandler<TCommand, TResult> {
  handle(command: TCommand): Promise<TResult>;
  repository: GenericCommandRepository<TResult>;
}
