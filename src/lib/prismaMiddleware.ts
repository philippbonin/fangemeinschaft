import { PrismaClient } from '@prisma/client';
import { isAuthenticated } from './auth';

// ✅ Logging Middleware
export function withLogging(params: any, next: (params: any) => Promise<any>) {
  const start = performance.now();
  return next(params)
    .then((result) => {
      const duration = performance.now() - start;
      console.log(`${params.model}.${params.action} completed in ${duration}ms`);
      if (duration > 100) console.warn(`Slow query detected: ${params.model}.${params.action}`);
      return result;
    })
    .catch((error) => {
      console.error(`Error in ${params.model}.${params.action}:`, error);
      throw error;
    });
}

// ✅ Authentication Middleware
export async function withAuthentication(params: any, next: (params: any) => Promise<any>) {
  // Skip authentication for read operations and non-authenticated models
  if (['findUnique', 'findFirst', 'findMany'].includes(params.action)) {
    return next(params);
  }

  // Get request from context
  const request = params.args?._ctx?.req;
  if (!request) {
    throw new Error('Request context required for authenticated operations');
  }

  // Verify authentication
  const isAuth = await isAuthenticated(request);
  if (!isAuth) {
    throw new Error('Unauthorized');
  }

  // Remove _ctx from args before passing to next middleware
  const { _ctx, ...args } = params.args;
  params.args = args;

  return next(params);
}

// ✅ Rate Limit Middleware
export function withRateLimit(limit: number, window: number) {
  const rateLimits = new Map<string, { count: number; resetTime: number }>();

  return async (params: any, next: (params: any) => Promise<any>) => {
    const token = params.args?._ctx?.req?.headers?.get('Authorization')?.split(' ')[1] || 'anonymous';
    const entry = rateLimits.get(token) || { count: 0, resetTime: Date.now() + window };

    if (entry.count >= limit && Date.now() < entry.resetTime) {
      throw new Error('Rate limit exceeded');
    }

    entry.count++;
    rateLimits.set(token, entry);
    return next(params);
  };
}

// ✅ Soft Delete Middleware
export function withSoftDelete(params: any, next: (params: any) => Promise<any>) {
  // Skip soft delete for assets - use hard delete instead
  if (params.model === 'Asset') {
    return next(params);
  }

  // Apply soft delete for other models
  if (params.action === 'delete') {
    params.action = 'update';
    params.args.data = { deleted: true, deletedAt: new Date() };
  }
  if (params.action === 'deleteMany') {
    params.action = 'updateMany';
    params.args.data = { deleted: true, deletedAt: new Date() };
  }
  return next(params);
}

// ✅ Cache Middleware
export async function withCache(params: any, next: (params: any) => Promise<any>) {
  const cache = new Map();
  const CACHE_TTL = 60 * 1000; // 1 minute

  if (params.action === 'findUnique' || params.action === 'findFirst') {
    const key = `${params.model}-${JSON.stringify(params.args)}`;
    const cached = cache.get(key);
    
    if (cached && cached.timestamp > Date.now() - CACHE_TTL) {
      return cached.data;
    }

    const result = await next(params);
    if (result) {
      cache.set(key, { data: result, timestamp: Date.now() });
    }
    return result;
  }
  return next(params);
}