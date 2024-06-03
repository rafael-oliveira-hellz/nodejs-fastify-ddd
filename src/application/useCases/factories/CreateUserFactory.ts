import { makeCreateUserCommandHandlerFactory } from '../../commands/factories/CreateUserCommandHandlerFactory';
import { CreateUserUseCaseImpl } from '../implementation/CreateUserUseCaseImpl';

/**
 * Creates a factory function for the CreateUserUseCase.
 *
 * @return {CreateUserUseCaseImpl} An instance of CreateUserUseCaseImpl.
 */
export const makeCreateUserUseCaseFactory = (): CreateUserUseCaseImpl => {
  return new CreateUserUseCaseImpl(makeCreateUserCommandHandlerFactory());
};
