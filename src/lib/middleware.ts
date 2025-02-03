import { PrismaClient } from '@prisma/client';
import { validateData } from './validation';
import { handlePrismaError } from './errors';
import { z } from 'zod';

export function withValidation<T>(schema: z.ZodSchema<T>) {
  return async (
    params: any,
    next: (params: any) => Promise<any>
  ) => {
    try {
      if (params.args?.data) {
        params.args.data = await validateData(schema, params.args.data);
      }
      return next(params);
    } catch (error) {
      handlePrismaError(error, params.model, params.action);
    }
  };
}

export function withLogging(prisma: PrismaClient) {
  return async (
    params: any,
    next: (params: any) => Promise<any>
  ) => {
    const start = performance.now();
    try {
      const result = await next(params);
      const duration = performance.now() - start;
      
      console.log(`${params.model}.${params.action} completed in ${duration}ms`);
      if (duration > 100) {
        console.warn(`Slow query detected: ${params.model}.${params.action}`);
      }
      
      return result;
    } catch (error) {
      console.error(`Error in ${params.model}.${params.action}:`, error);
      throw error;
    }
  };
}

export function withAuditLog(prisma: PrismaClient) {
  return async (
    params: any,
    next: (params: any) => Promise<any>
  ) => {
    const before = params.action.startsWith('update') || params.action === 'delete' 
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
          timestamp: new Date()
        }
      });
    }

    return result;
  };
}

export function withCache(ttl = 60000) {
  const cache = new Map();
  
  return async (
    params: any,
    next: (params: any) => Promise<any>
  ) => {
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      const key = `${params.model}-${JSON.stringify(params.args)}`;
      const cached = cache.get(key);
      
      if (cached && cached.timestamp > Date.now() - ttl) {
        return cached.data;
      }

      const result = await next(params);
      if (result) {
        cache.set(key, { data: result, timestamp: Date.now() });
      }
      return result;
    }

    return next(params);
  };
}

export function withSoftDelete() {
  return async (
    params: any,
    next: (params: any) => Promise<any>
  ) => {
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = { deleted: true, deletedAt: new Date() };
    }
    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      params.args.data = { deleted: true, deletedAt: new Date() };
    }
    return next(params);
  };
}