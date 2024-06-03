import pino from 'pino';

const transport = pino.transport({
  targets: [
    {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
    {
      target: 'pino/file',
      options: {
        destination: 1,
      },
    },
  ],
});

const logger = pino(transport);

export const info = (message: string, extras?: object) =>
  logger.info({ extras }, message);

export const error = (message: string, extras?: object) =>
  logger.error({ extras }, message);

export const debug = (message: string, extras?: object) =>
  logger.debug({ extras }, message);

export const warn = (message: string, extras?: object) =>
  logger.warn({ extras }, message);
