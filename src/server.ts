import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config/env';
import { logger } from './utils/logger';
import { schema } from './schema';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

export const startServer = async () => {
  // Create Express application
  const app = express();

  // Apply middleware
  app.use(cors());
  app.use(helmet({ contentSecurityPolicy: config.NODE_ENV === 'production' ? undefined : false }));
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(authMiddleware);

  // Health check endpoint
  app.get('/health', (_, res) => {
    res.status(200).send('OK');
  });

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      return {
        user: req.user,
        token: req.headers.authorization?.split(' ')[1] || '',
      };
    },
    formatError: (error) => {
      logger.error('GraphQL Error:', error);
      
      // Don't expose internal server errors to clients in production
      if (config.NODE_ENV === 'production' && error.extensions?.code === 'INTERNAL_SERVER_ERROR') {
        return new Error('Internal server error');
      }
      
      return error;
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  // Apply error handler after Apollo middleware
  app.use(errorHandler);

  // Create HTTP server
  const httpServer = createServer(app);
  httpServer.listen(config.PORT, () => {
    logger.info(`Server listening on port ${config.PORT}`);
  });

  return { server, httpServer };
};

