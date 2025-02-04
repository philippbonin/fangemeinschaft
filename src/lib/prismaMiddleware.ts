import { PrismaClient } from '@prisma/client';
import { validateRequest } from '../middleware/validation'; // Used in validation middleware

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

// ✅ Authentication Middleware (For Prisma)
export async function withAuthentication(params: any, next: (params: any) => Promise<any>) {
  if (['create', 'update', 'delete'].includes(params.action)) {
    const userToken = params.args?.token;
    if (!userToken) throw new Error('Unauthorized');

    const user = await verifyToken(userToken);
    if (!user) throw new Error('Invalid or expired token');

    params.args.data.modifiedBy = user.userId; // Track changes
  }
  return next(params);
}

// ✅ Audit Logging Middleware
export async function withAuditLog(params: any, next: (params: any) => Promise<any>) {
  const prisma = new PrismaClient();
  const before =
    params.action.startsWith('update') || params.action === 'delete'
      ? await prisma[params.model].findUnique({ where: params.args.where })
      : null;

  const result = await next(params);

  if (['create', 'update', 'delete'].includes(params.action)) {
    await prisma.auditLog.create({
      data: {
        model: params.model,
        action: params.action,
        recordId: result?.id,
        before: before ? JSON.stringify(before) : null,
        after: result ? JSON.stringify(result) : null,
        timestamp: new Date(),
      },
    });
  }

  return result;
}

// ✅ Rate Limit Middleware
export function withRateLimit(limit: number, window: number) {
  const rateLimits = new Map<string, { count: number; resetTime: number }>();

  return async (params: any, next: (params: any) => Promise<any>) => {
    const token = params.args?.token || 'anonymous';
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

// ✅ Request Validation Middleware (Using Imported `validateRequest`)
export function withValidation(schema: any) {
  return async (params: any, next: (params: any) => Promise<any>) => {
    try {
      if (params.args?.data) {
        params.args.data = await validateRequest(schema);
      }
      return next(params);
    } catch (error) {
      throw new Error('Validation failed');
    }
  };
}
