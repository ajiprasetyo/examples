import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config/env';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    // Operational, trusted error: send message to client
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  logger.error('Unhandled error:', err);
  
  // In development, send the error details
  if (config.NODE_ENV === 'development') {
    return res.status(500).json({
      status: 'error',
      message: err.message,
      stack: err.stack,
    });
  }
  
  // In production, send a generic message
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

