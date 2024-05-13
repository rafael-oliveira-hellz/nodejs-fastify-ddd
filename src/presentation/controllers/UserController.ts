import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { makeCreateUserUseCaseFactory } from "../../application/useCases/factories/CreateUserFactory";
import { CreateUserDTO } from "./../../application/dtos/CreateUserDTO";

export async function userRoutes(fastify: FastifyInstance, _options: unknown) {
  fastify.post(
    "/users",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const dto: CreateUserDTO = request.body as CreateUserDTO;
      const createUserUseCase = makeCreateUserUseCaseFactory();

      try {
        await createUserUseCase.execute(dto);
        return reply.code(201).send({ message: "User created successfully" });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
