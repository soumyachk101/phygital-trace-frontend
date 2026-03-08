import { redis } from '../config/redis';

export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached) as T;
  const result = await fn();
  await redis.setex(key, ttlSeconds, JSON.stringify(result));
  return result;
}

export async function invalidateCache(key: string): Promise<void> {
  await redis.del(key);
}
