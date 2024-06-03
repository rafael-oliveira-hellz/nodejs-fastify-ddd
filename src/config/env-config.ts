import pkg from '../../package.json';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  APP_PORT: z.coerce.number().default(5000),
  APP: z.string().min(1),
  RABBITMQ_URI: z.string().min(1),
  CACHE_URI: z.string().min(1),
  CACHE_TYPE: z.string().default('InMemory'),
  REDIS_URL: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_USERNAME: z.string(),
  REDIS_PASSWORD: z.string(),
  HOST: z.string().default('localhost'),
  OBSERVABILITY_LOCAL: z
    .string()
    .default('false')
    .transform((value) => value.toLowerCase() === 'true'),
  JWT_SECRET: z.string().min(1),
  DATABASE_HOST: z.string().min(1),
  DATABASE_NAME: z.string().default('db_user_management'),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  VERSION: z.string().default(pkg.version),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌  Invalid environment variables:', _env.error.format());
  process.exit(1);
}

const env = _env.data;

const CONFIG = {
  APP: {
    PORT: env.APP_PORT,
    NAME: env.APP,
    VERSION: env.VERSION,
    ENVIRONMENT: env.NODE_ENV,
    HOST: env.HOST,
    CONTEXT: env.APP,
  },
  OBSERVABILITY: {
    LOCAL: env.OBSERVABILITY_LOCAL,
  },
  RABBITMQ: {
    URI: env.RABBITMQ_URI,
  },
  CACHE: {
    URI: env.CACHE_URI,
  },
  REDIS: {
    URL: env.REDIS_URL,
    HOST: env.REDIS_HOST,
    PORT: env.REDIS_PORT,
    USERNAME: env.REDIS_USERNAME,
    PASSWORD: env.REDIS_PASSWORD,
  },
  DATABASE: {
    HOST: env.DATABASE_HOST,
    NAME: env.DATABASE_NAME,
    USERNAME: env.DATABASE_USERNAME,
    PASSWORD: env.DATABASE_PASSWORD,
  },
  AUTH: {
    JWT_SECRET: env.JWT_SECRET,
  },
};

export default CONFIG;
