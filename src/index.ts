import './shared/loadEnv';

// Tracing
import './config/tracing';

// Other imports
import { createApp } from './server';
import { configureDIContainer } from './shared/ConfigureDIContainer';
/**
 * Asynchronously starts the server by configuring the DI container, creating an app, and listening on the port specified in the environment variables.
 *
 * @return {Promise<void>} Promise that resolves when the server is started.
 */
const startServer = async (): Promise<void> => {
  await configureDIContainer();

  const app = createApp();

  app.listen(
    { port: Number(process.env.APP_PORT), host: '0.0.0.0' },
    (err, address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }

      app.log.info(`server listening on ${address}`);
    },
  );
};

startServer();
