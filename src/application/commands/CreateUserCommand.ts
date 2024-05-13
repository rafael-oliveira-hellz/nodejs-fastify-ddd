// src/application/commands/CreateUserCommand.ts
import { CreateUserDTO } from "../dtos/CreateUserDTO";

export class CreateUserCommand {
  constructor(public readonly dto: CreateUserDTO) {}
}
