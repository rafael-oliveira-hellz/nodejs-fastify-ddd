import { FastifyInstance } from 'fastify';
import { userRoutes } from './UserRoutes';

/**
 * Registers the user routes with the Fastify instance.
 *
 * @param {FastifyInstance} fastify - The Fastify instance.
 * @return {Promise<void>} Promise that resolves after registering the routes.
 */
export async function routes(fastify: FastifyInstance): Promise<void> {
  await fastify.register(userRoutes);
}
