import { Request, Response, NextFunction } from 'express';
import { generateId } from '../utils/id.utils';

export function requestId(req: Request, _res: Response, next: NextFunction): void {
  req.requestId = (req.headers['x-request-id'] as string) || generateId('req');
  next();
}
