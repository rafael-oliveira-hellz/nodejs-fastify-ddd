// src/application/commands/CreateUserCommand.ts
import { CreateUserDTO } from "../dtos/CreateUserDTO";

export class CreateUserCommand {
  dto: CreateUserDTO;
  constructor(dto: CreateUserDTO) {
    this.dto = dto;
  }
}
