import { IUserCommandRepository } from "../../../domain/contracts/IUserCommandRepository";
import { User } from "../../../domain/entities/User";
import { IRepositoryFactory } from "../../../infrastructure/factories/interfaces/IRepositoryFactory";
import DIContainer from "../../../shared/DIContainer";
import { Transactional } from "../../decorators/TransactionDecorator";
import { CreateUserCommand } from "../CreateUserCommand";

export class CreateUserCommandHandler {
  private userCommandRepository: IUserCommandRepository;

  /**
   * Constructor for the class.
   *
   * This constructor initializes the `userCommandRepository` property by resolving an instance of `IRepositoryFactory` from the `DIContainer` and creating a repository for `User` entities with the collection name "users".
   *
   * @return {void}
   */
  constructor() {
    const factory =
      DIContainer.resolve<IRepositoryFactory>("IRepositoryFactory");
    this.userCommandRepository = factory.createRepository<User>("users");
  }

  /**
   * Handles the given CreateUserCommand by creating a new User entity with the provided username, email, and password,
   * and then saving it to the userCommandRepository.
   *
   * @param {CreateUserCommand} command - The CreateUserCommand to handle.
   * @return {Promise<void>} A Promise that resolves when the user is successfully created and saved.
   */
  @Transactional()
  async handle(command: CreateUserCommand): Promise<void> {
    const { username, email, password } = command.dto;
    const user = new User(username, email, password);

    return this.userCommandRepository.create(user);
  }
}
