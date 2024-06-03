import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError, ZodSchema } from 'zod';
import { makeCreateUserUseCaseFactory } from '../../application/useCases/factories/CreateUserFactory';
import * as logger from '../../config/logger';
import {
  CreateUserDTO,
  CreatedUserDTO,
  createUserSchema,
  createdUserSchema,
} from '../../domain/schemas/UserSchema';

export class UserController {
  /**
   * Asynchronously creates a user based on the provided request data.
   *
   * @param {FastifyRequest} request - The request object containing user data.
   * @param {FastifyReply} reply - The reply object for sending responses.
   * @return {Promise<void>} A Promise that resolves once the user is created successfully.
   */
  async createUser(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const createUserDTO = validateInput<CreateUserDTO>(
        createUserSchema,
        request.body,
      );
      const createdUser = await createUser(createUserDTO);
      const validatedCreatedUser = validateInput<CreatedUserDTO>(
        createdUserSchema,
        createdUser,
      );

      reply.code(201).send(validatedCreatedUser);
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error(error.message, { issues: error.errors });
        reply.code(422).send({ issues: error.errors });
      }

      logger.error('Internal Server Error', { error });
      reply.code(500).send({ message: 'Internal Server Error', error });
    }
  }
}

function validateInput<T>(schema: ZodSchema<T>, data: unknown): T {
  const parseResult = schema.safeParse(data);
  if (!parseResult.success) {
    logger.error(parseResult.error.message, parseResult.error.errors);
    throw new ZodError(parseResult.error.errors);
  }
  return parseResult.data;
}

async function createUser(
  createUserDTO: CreateUserDTO,
): Promise<CreatedUserDTO> {
  const createUserUseCase = makeCreateUserUseCaseFactory();
  return await createUserUseCase.execute(createUserDTO);
}
