import DIContainer from "../../../shared/DIContainer";
import { CreateUserCommand } from "../../commands/CreateUserCommand";
import { CreateUserCommandHandler } from "../../commands/handlers/CreateUserCommandHandler";
import { CreateUserDTO } from "../../dtos/CreateUserDTO";
import { ICreateUserUsecase } from "../ICreateUserUsecase";

export class CreateUserUseCaseImpl implements ICreateUserUsecase {
  async execute(dto: CreateUserDTO): Promise<void> {
    const handler = DIContainer.resolve<CreateUserCommandHandler>(
      "CreateUserCommandHandler"
    );
    const command = new CreateUserCommand(dto);
    await handler.handle(command);
  }
}
