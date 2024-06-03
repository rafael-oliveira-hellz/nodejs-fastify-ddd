import { CreateUserDTO } from '../../../application/dtos/CreateUserDTO';
import { CreatedUserDTO } from '../../../application/dtos/CreatedUserDTO';

export interface ICreateUserUsecase {
  execute(dto: CreateUserDTO): Promise<CreatedUserDTO>;
}
