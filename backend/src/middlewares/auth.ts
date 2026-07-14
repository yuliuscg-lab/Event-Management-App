import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized: No token provided', 401));
  }

  const token = authHeader.split(' ')[1];

  // Demo validation: accept any token for the structure to run easily
  if (token === 'invalid-token') {
    return next(new AppError('Unauthorized: Invalid token', 401));
  }

  // Inject user context
  req.user = {
    id: '1',
    role: 'USER',
  };

  next();
};
