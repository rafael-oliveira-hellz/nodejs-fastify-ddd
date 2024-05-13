import { IUserWriteRepository } from "../../../domain/contracts/IUserRepository";
import { User } from "../../../domain/entities/User";
import { IRepositoryFactory } from "../../../infrastructure/factories/interfaces/IRepositoryFactory";
import DIContainer from "../../../shared/DIContainer";
import { Transactional } from "../../decorators/TransactionDecorator";
import { CreateUserCommand } from "../CreateUserCommand";

export class CreateUserCommandHandler {
  private userRepository: IUserWriteRepository;

  constructor() {
    const factory =
      DIContainer.resolve<IRepositoryFactory>("IRepositoryFactory");
    this.userRepository = factory.createWriteRepository<User>("users");
  }

  @Transactional()
  async handle(command: CreateUserCommand): Promise<void> {
    const { username, email, password } = command.dto;
    const user = new User(username, email, password);

    return this.userRepository.create(user);
  }
}
