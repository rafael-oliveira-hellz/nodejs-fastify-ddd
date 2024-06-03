import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import client from 'prom-client';

export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_microseconds',
  help: 'Duration of HTTP requests in microseconds.',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
});

export const httpRequestTotals = new client.Counter({
  name: 'http_request_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method'],
});

interface ErrorCounters {
  [statusCode: number]: client.Counter<string>;
}

const errorCounters: ErrorCounters = {
  400: new client.Counter({
    name: 'http_400_errors_total',
    help: 'Total number of HTTP 400 errors',
    labelNames: ['method', 'route', 'status'],
  }),
  401: new client.Counter({
    name: 'http_401_errors_total',
    help: 'Total number of HTTP 401 errors',
    labelNames: ['method', 'route', 'status'],
  }),
  402: new client.Counter({
    name: 'http_402_errors_total',
    help: 'Total number of HTTP 402 errors',
    labelNames: ['method', 'route', 'status'],
  }),
  403: new client.Counter({
    name: 'http_403_errors_total',
    help: 'Total number of HTTP 403 errors',
    labelNames: ['method', 'route', 'status'],
  }),
  404: new client.Counter({
    name: 'http_404_errors_total',
    help: 'Total number of HTTP 404 errors',
    labelNames: ['method', 'route', 'status'],
  }),
  409: new client.Counter({
    name: 'http_409_errors_total',
    help: 'Total number of HTTP 409 errors',
    labelNames: ['method', 'route', 'status'],
  }),
  422: new client.Counter({
    name: 'http_422_errors_total',
    help: 'Total number of HTTP 422 errors',
    labelNames: ['method', 'route', 'status'],
  }),
  500: new client.Counter({
    name: 'http_500_errors_total',
    help: 'Total number of HTTP 500 errors',
    labelNames: ['method', 'route', 'status'],
  }),
  501: new client.Counter({
    name: 'http_501_errors_total',
    help: 'Total number of HTTP 501 errors',
    labelNames: ['method', 'route', 'status'],
  }),
  502: new client.Counter({
    name: 'http_502_errors_total',
    help: 'Total number of HTTP 502 errors',
    labelNames: ['method', 'route', 'status'],
  }),
  503: new client.Counter({
    name: 'http_503_errors_total',
    help: 'Total number of HTTP 503 errors',
    labelNames: ['method', 'route', 'status'],
  }),
  504: new client.Counter({
    name: 'http_504_errors_total',
    help: 'Total number of HTTP 504 errors',
    labelNames: ['method', 'route', 'status'],
  }),
};

const register = new client.Registry();
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestTotals);

Object.values(errorCounters).forEach((counter) =>
  register.registerMetric(counter),
);

client.collectDefaultMetrics({ register });

/**
 * Handles the metrics endpoint by sending the collected metrics.
 *
 * @param {FastifyRequest} request - The request object.
 * @param {FastifyReply} reply - The reply object.
 * @return {Promise<void>} A promise resolving after sending the metrics.
 */
export const metrics = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  reply.header('Content-Type', register.contentType);
  reply.send(await register.metrics());
};

/**
 * Adds monitoring hooks to track request and response times.
 *
 * @param {FastifyInstance} fastify - The Fastify instance to add hooks to.
 */
export const addMonitoringHooks = (fastify: FastifyInstance) => {
  fastify.addHook('onRequest', async (request, _reply) => {
    request.startEpoch = Date.now();
  });

  fastify.addHook('onResponse', async (request, reply) => {
    const responseTimeInMs = Date.now() - (request.startEpoch ?? Date.now());

    httpRequestDurationMicroseconds
      .labels(
        request.method,
        request.routerPath ?? '',
        reply.statusCode.toString(),
      )
      .observe(responseTimeInMs);

    httpRequestTotals.inc({ method: request.method });

    console.log(
      `${request.method} ${request.routerPath} ${reply.statusCode} ${responseTimeInMs}ms`,
    );

    if (errorCounters[reply.statusCode]) {
      errorCounters[reply.statusCode].inc({
        method: request.method,
        route: request.routerPath ?? '',
        status: reply.statusCode.toString(),
      });
    }
  });
};
