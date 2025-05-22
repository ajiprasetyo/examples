import mongoose from 'mongoose';
import { config } from './env';
import { logger } from '../utils/logger';
import { seedDatabase } from '../utils/seed';

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    
    // Log successful connection
    logger.info('MongoDB connection established successfully');
    
    // Seed database with initial data
    await seedDatabase();
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};
