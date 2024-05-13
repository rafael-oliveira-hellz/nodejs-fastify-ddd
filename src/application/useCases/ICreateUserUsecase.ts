import { CreateUserDTO } from "../dtos/CreateUserDTO";

export interface ICreateUserUsecase {
  execute(dto: CreateUserDTO): Promise<void>;
}
