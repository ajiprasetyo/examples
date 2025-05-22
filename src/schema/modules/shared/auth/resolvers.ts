import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server-express';
import { User } from '../models';
import { config } from '../../../../config/env';
import { UserRole } from '../../../../constants';
import { LoginInput, RegisterInput } from '../../../../types';
import { validateLoginInput, validateRegisterInput } from './validators';

export const authResolvers = {
  Mutation: {
    registerUser: async (_: any, { input }: { input: RegisterInput }) => {
      // Validate input
      const errors = validateRegisterInput(input);
      if (Object.keys(errors).length > 0) {
        throw new UserInputError('Invalid input', { errors });
      }

      const { name, email, password } = input;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new UserInputError('Email already in use');
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
        role: UserRole.USER,
      });

      // Save user to database
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    },

    loginUser: async (_: any, { input }: { input: LoginInput }) => {
      // Validate input
      const errors = validateLoginInput(input);
      if (Object.keys(errors).length > 0) {
        throw new UserInputError('Invalid input', { errors });
      }

      const { email, password } = input;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new UserInputError('Invalid email or password');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new UserInputError('Invalid email or password');
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    },

    loginAdmin: async (_: any, { input }: { input: LoginInput }) => {
      // Validate input
      const errors = validateLoginInput(input);
      if (Object.keys(errors).length > 0) {
        throw new UserInputError('Invalid input', { errors });
      }

      const { email, password } = input;

      // Find admin by email
      const admin = await User.findOne({ email, role: UserRole.ADMIN });
      if (!admin) {
        throw new UserInputError('Invalid email or password');
      }

      // Check password
      const isPasswordValid = await admin.comparePassword(password);
      if (!isPasswordValid) {
        throw new UserInputError('Invalid email or password');
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      return {
        token,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt,
        },
      };
    },
  },
};

