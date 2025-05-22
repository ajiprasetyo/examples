import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { logger } from '../utils/logger';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      // No token provided, continue without authentication
      return next();
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      // No token provided, continue without authentication
      return next();
    }
    
    // Verify the token
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    
    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    // Continue without authentication if token is invalid
    next();
  }
};

// Helper function to check if user is authenticated in GraphQL context
export const isAuthenticated = (context: { user?: JwtPayload }) => {
  if (!context.user) {
    throw new Error('Not authenticated');
  }
  return context.user;
};

// Helper function to check if user is an admin in GraphQL context
export const isAdmin = (context: { user?: JwtPayload }) => {
  const user = isAuthenticated(context);
  if (user.role !== 'admin') {
    throw new Error('Not authorized. Admin access required');
  }
  return user;
};

