import { User } from '../schema/modules/shared/models';
import { config } from '../config/env';
import { UserRole } from '../constants';
import { logger } from './logger';

export const seedDatabase = async (): Promise<void> => {
  try {
    // Check if admin user already exists
    const adminExists = await User.findOne({ email: config.ADMIN_EMAIL });
    
    if (!adminExists) {
      logger.info('Seeding admin user...');
      
      // Create admin user
      const admin = new User({
        name: config.ADMIN_NAME,
        email: config.ADMIN_EMAIL,
        password: config.ADMIN_PASSWORD,
        role: UserRole.ADMIN,
      });
      
      await admin.save();
      logger.info('Admin user created successfully');
    } else {
      logger.info('Admin user already exists, skipping seed');
    }
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
};

