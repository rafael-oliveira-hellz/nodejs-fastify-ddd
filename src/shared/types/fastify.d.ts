import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    startEpoch?: number;
  }
}
