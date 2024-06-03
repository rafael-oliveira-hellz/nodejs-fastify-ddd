import { CreateUserDTO } from '../../../application/dtos/CreateUserDTO';
import { CreatedUserDTO } from '../../../application/dtos/CreatedUserDTO';
import { UserCreatedEvent } from '../../../application/events/UserCreatedEvent';
import { UserCreatedEventHandler } from '../../../application/events/handlers/UserCreatedEventHandler';
import { User } from '../../../domain/models/User';
import { GenericCacheServiceFactory } from '../../../infrastructure/caching/GenericCacheServiceFactory';
import { ICacheService } from '../../../infrastructure/caching/interfaces/ICacheInterface';
import DIContainer from '../../../shared/DIContainer';
import { CreateUserCommand } from '../../commands/CreateUserCommand';
import { CreateUserCommandHandler } from '../../commands/handlers/CreateUserCommandHandler';
import { ICreateUserUsecase } from '../contracts/ICreateUserUsecase';
import { mapToCreatedUserDTO } from '../mappers/UserMapper';

export class CreateUserUseCaseImpl implements ICreateUserUsecase {
  private cacheService: ICacheService;
  private userCreatedEventHandler: UserCreatedEventHandler;

  /**
   * Resolve the MessageBrokerFactory from the DIContainer.
   *
   * @param {CreateUserCommandHandler} handler - an instance of CreateUserCommandHandler
   */
  constructor(private readonly handler: CreateUserCommandHandler) {
    /** Resolve the GenericCacheServiceFactory from the DIContainer. */
    const cacheServiceFactory = DIContainer.resolve<GenericCacheServiceFactory>(
      'GenericCacheServiceFactory',
    );

    this.cacheService = cacheServiceFactory.createCacheService(
      process.env.CACHE_TYPE ?? 'Redis',
    );

    this.userCreatedEventHandler = new UserCreatedEventHandler();
  }

  /**
   * Executes the createUser use case.
   *
   * @param {CreateUserDTO} dto - The data transfer object containing user information.
   * @return {Promise<void>} A Promise that resolves once the user is created successfully.
   */
  async execute(dto: CreateUserDTO): Promise<CreatedUserDTO> {
    const command = new CreateUserCommand(dto);

    // Recuperar o usuário do cache, se estiver disponível
    const cachedUser = await this.cacheService.get(`user:${dto.email}`);

    if (cachedUser) {
      console.log('User found in cache:', cachedUser);
      return JSON.parse(cachedUser);
    }

    // Se o usuário não estiver disponível no cache, executar a operação normalmente
    const createdUser: User = await this.handler.handle(command);

    const mappedUser = mapToCreatedUserDTO(createdUser);

    console.log('User mapped:', mappedUser);

    if (!createdUser.id) {
      console.error('User not created', { createdUser });
      throw new Error('User not created');
    }

    // Armazenar o usuário criado em cache para consultas futuras
    await this.cacheService.set(
      `user:${dto.email}`,
      JSON.stringify(mappedUser),
      86400,
    );

    /** Emitir o evento UserCreatedEvent após a criação do usuário */
    const userCreatedEvent = new UserCreatedEvent(createdUser.id);

    await this.userCreatedEventHandler.handle(userCreatedEvent);

    return mappedUser;
  }
}
