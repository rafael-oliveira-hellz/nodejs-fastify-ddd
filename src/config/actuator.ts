import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { metrics } from './prometheus';

/**
 * Sets up the actuator endpoints for retrieving information and health status.
 *
 * @param {FastifyInstance} fastify - The Fastify instance to register the actuator endpoints.
 */
export function setupActuator(fastify: FastifyInstance) {
  fastify.get(
    '/api/v1/actuator/info',
    async (_request: FastifyRequest, reply: FastifyReply) => {
      reply.send({
        status: 'UP',
        info: 'Actuator Info',
        mode: 'simple',
      });
    },
  );

  fastify.get(
    '/actuator/health',
    async (_request: FastifyRequest, reply: FastifyReply) => {
      reply.send({
        status: 'UP',
      });
    },
  );

  fastify.get('/actuator/prometheus', metrics);
}
