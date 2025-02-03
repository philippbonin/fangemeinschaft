import type { APIRoute } from 'astro';
import { getCache, setCache } from '../lib/cache';

export function withRateLimit(
  limit: number,
  window: number
): (handler: APIRoute) => APIRoute {
  return (handler: APIRoute) => {
    return async (context) => {
      const ip = context.request.headers.get('x-forwarded-for') || 'unknown';
      const key = `ratelimit:${ip}`;
      
      const current = await getCache<number>(key) || 0;
      if (current >= limit) {
        return new Response('Too Many Requests', { status: 429 });
      }
      
      await setCache(key, current + 1, window);
      return handler(context);
    };
  };
}