import pino from 'pino';
import { config } from '../config/env';

// Configure pino logger
export const logger = pino({
  level: config.LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
  base: {
    env: config.NODE_ENV,
  },
});

