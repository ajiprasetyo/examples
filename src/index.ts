import 'reflect-metadata';
import { config } from './config/env';
import { connectToDatabase } from './config/database';
import { startServer } from './server';
import { logger } from './utils/logger';

const bootstrap = async () => {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    logger.info('Connected to MongoDB');

    // Start the Apollo Server
    const { server, httpServer } = await startServer();
    logger.info(`🚀 Server ready at http://localhost:${config.PORT}${server.graphqlPath}`);
    
    // Handle graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down server...');
      await server.stop();
      httpServer.close(() => {
        logger.info('Server has been stopped');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

bootstrap();

