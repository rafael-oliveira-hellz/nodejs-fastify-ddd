import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import DIContainer from "../../shared/DIContainer";
import { CreateUserDTO } from "./../../application/dtos/CreateUserDTO";
import { ICreateUserUsecase } from "./../../application/useCases/ICreateUserUsecase";

export async function userRoutes(fastify: FastifyInstance, _options: unknown) {
  fastify.post(
    "/users",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const dto: CreateUserDTO = request.body as CreateUserDTO;
      const createUserUseCase =
        DIContainer.resolve<ICreateUserUsecase>("CreateUserUseCase");

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
