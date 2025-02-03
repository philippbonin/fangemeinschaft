import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

export async function getCache<T>(key: string): Promise<T | null> {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
}

export async function setCache<T>(
  key: string, 
  data: T, 
  ttl = 3600
): Promise<void> {
  await client.set(key, JSON.stringify(data), { EX: ttl });
}

export async function deleteCache(key: string): Promise<void> {
  await client.del(key);
}

export async function clearCache(): Promise<void> {
  await client.flushAll();
}