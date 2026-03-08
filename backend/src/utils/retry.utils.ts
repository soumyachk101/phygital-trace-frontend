import { logger } from './logger';

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; baseDelay?: number; name?: string } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, name = 'operation' } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = baseDelay * Math.pow(2, attempt - 1);
      logger.warn({ attempt, maxRetries, delay, name }, `Retrying ${name}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error(`${name} failed after ${maxRetries} retries`);
}
