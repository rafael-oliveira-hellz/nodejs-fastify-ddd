import Fastify from "fastify";
import { userRoutes } from "./presentation/controllers/UserController";
import { configureDIContainer } from "./shared/ConfigureDIContainer";

const server = Fastify({ logger: true });

configureDIContainer();

server.register(userRoutes);

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
