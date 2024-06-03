import cookieParser from '@fastify/cookie';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import fastifyRequestContext from '@fastify/request-context';
import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { addMonitoringHooks, metrics } from './config/prometheus';
import { routes } from './presentation/routes';

/**
 * Creates and configures a Fastify server instance with various routes and hooks.
 *
 * @return {FastifyInstance} The configured Fastify server instance.
 */
export const createApp = (): FastifyInstance => {
  const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
    Fastify({ logger: true });

  server.register(fastifyRequestContext);
  server.register(cors, {});
  server.register(cookieParser, {});
  server.register(formbody);
  server.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  });

  function logRequest(
    req: FastifyRequest,
    res: FastifyReply,
    done: HookHandlerDoneFunction,
  ) {
    const { method, url } = req.raw;
    const { statusCode } = res;

    const start = process.hrtime();

    res.raw.on('finish', () => {
      const [sec, nanosec] = process.hrtime(start);
      const responseTime = (sec * 1000 + nanosec / 1e6).toFixed(2);

      server.log.info(`${method} ${url} ${statusCode} ${responseTime}ms`);
    });

    done();
  }

  server.addHook('onRequest', logRequest);

  addMonitoringHooks(server);

  // setUpSwagger(server, `/${process.env.CONTEXT}/api/v1`);

  server.register(routes, { prefix: `/${process.env.CONTEXT}/api/v1` });
  server.get('/metrics', metrics);

  server.ready((err) => {
    if (err) throw err;
    console.log(server.printRoutes());
  });

  return server;
};
