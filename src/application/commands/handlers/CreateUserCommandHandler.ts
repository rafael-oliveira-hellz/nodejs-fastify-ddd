import { User } from '../../../domain/models/User';
import { GenericCommandRepository } from '../../../infrastructure/database/GenericCommandRepository';
import { Transactional } from '../../decorators/TransactionDecorator';
import { CreateUserCommand } from '../CreateUserCommand';
import { ICommandHandler } from '../contracts/ICommandHandler';

export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, User>
{
  public repository: GenericCommandRepository<User>;

  constructor(userCommandRepository: GenericCommandRepository<User>) {
    this.repository = userCommandRepository;
  }
  /**
   * Handles the given CreateUserCommand by creating a new User entity with the provided username, email, and password,
   * and then saving it to the userCommandRepository.
   *
   * @param {CreateUserCommand} command - The CreateUserCommand to handle.
   * @return {Promise<void>} A Promise that resolves when the user is successfully created and saved.
   */
  @Transactional<CreateUserCommand, User>()
  async handle(command: CreateUserCommand): Promise<User> {
    const { username, email, password } = command.dto;
    const user = new User(username, email, password);

    return await this.repository.create('users', user);
  }
}
