import { CreateUserCommand } from "../../commands/CreateUserCommand";
import { CreateUserCommandHandler } from "../../commands/handlers/CreateUserCommandHandler";
import { CreateUserDTO } from "../../dtos/CreateUserDTO";
import { ICreateUserUsecase } from "../ICreateUserUsecase";

export class CreateUserUseCaseImpl implements ICreateUserUsecase {
  constructor(private readonly handler: CreateUserCommandHandler) {}

  async execute(dto: CreateUserDTO): Promise<void> {
    const command = new CreateUserCommand(dto);
    return await this.handler.handle(command);
  }
}
