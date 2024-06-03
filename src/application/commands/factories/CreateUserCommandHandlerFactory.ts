import { User } from '../../../domain/models/User';
import { GenericCommandRepository } from '../../../infrastructure/database/GenericCommandRepository';
import { IRepositoryFactory } from '../../../infrastructure/factories/interfaces/IRepositoryFactory';
import DIContainer from '../../../shared/DIContainer';
import { CreateUserCommandHandler } from '../handlers/CreateUserCommandHandler';

/**
 * Creates a factory function for the CreateUserCommandHandler.
 *
 * @return {CreateUserCommandHandler} An instance of CreateUserCommandHandler.
 */
export const makeCreateUserCommandHandlerFactory = () => {
  const factory = DIContainer.resolve<IRepositoryFactory>('RepositoryFactory');
  const userCommandRepository: GenericCommandRepository<User> =
    factory.createCommandRepository('users');
  return new CreateUserCommandHandler(userCommandRepository);
};
