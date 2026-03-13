import * as z from 'zod';

import { parseStringList } from '@/common/string-util';

import { NODE_ENVS } from './app-constant';

export const AppConfig = z.object({
  // NodeJS
  NODE_ENV: z.enum(NODE_ENVS).default('local'),

  // Application
  HOST: z.ipv4().default('127.0.0.1'),
  PORT: z.coerce.number().min(1024).max(65535).default(3000),
  CORS: z.string().transform((s) => parseStringList(s)),

  // API
  API_PREFIX: z.string().default('/'),

  // HTTP
  HTTP_SOCKET_TIMEOUT: z.coerce.number().min(0).default(30_000),
  HTTP_REQUEST_TIMEOUT: z.coerce.number().min(0).default(6_000),
  HTTP_HEADERS_TIMEOUT: z.coerce.number().min(0).default(3_000),
  HTTP_KEEP_ALIVE_TIMEOUT: z.coerce.number().min(0).default(72_000),

  // Logging
  LOGGING_ERROR_STACK: z.stringbool().default(false),
  LOGGING_ERROR_IGNORE_NAMES: z.string().transform((s) => parseStringList(s)),
  LOGGING_ERROR_IGNORE_URLS: z.string().transform((s) => parseStringList(s)),
});
export type AppConfig = z.infer<typeof AppConfig>;
