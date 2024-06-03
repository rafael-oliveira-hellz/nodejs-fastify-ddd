import { CreatedUserDTO } from '../../../application/dtos/CreatedUserDTO';
import { User } from '../../../domain/models/User';

export function mapToCreatedUserDTO(user: User): CreatedUserDTO {
  return {
    id: user.id ?? '',
    username: user.username,
    email: user.email,
  };
}
