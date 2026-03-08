import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';
import { RateLimitError } from '../types/errors.types';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyPrefix?: string;
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max, keyPrefix = 'rl' } = options;
  const windowSeconds = Math.ceil(windowMs / 1000);

  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const key = `${keyPrefix}:${req.ip}`;
    try {
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, windowSeconds);
      }
      if (current > max) {
        throw new RateLimitError();
      }
      next();
    } catch (error) {
      if (error instanceof RateLimitError) throw error;
      // If Redis is down, allow the request
      next();
    }
  };
}
