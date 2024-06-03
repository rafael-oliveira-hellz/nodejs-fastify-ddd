import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/UserController';

const userController = new UserController();

/**
 * A function to define user routes.
 *
 * @param {FastifyInstance} fastify - The Fastify instance.
 */
export async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/users', userController.createUser.bind(userController));
}
