import { PrismaClient } from '@prisma/client';
import { handlePrismaError } from './errors';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || 
  new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
    ],
  });

// Logging middleware
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Duration: ' + e.duration + 'ms');
  console.log('Parameters:', e.params);
});

prisma.$on('error', (e) => {
  console.error('Prisma Error:', e.message);
});

prisma.$on('info', (e) => {
  console.info('Prisma Info:', e.message);
});

prisma.$on('warn', (e) => {
  console.warn('Prisma Warning:', e.message);
});

// Error handling middleware
prisma.$use(async (params, next) => {
  try {
    const result = await next(params);
    return result;
  } catch (error) {
    handlePrismaError(error, params.model, params.action);
  }
});

// Performance monitoring middleware
prisma.$use(async (params, next) => {
  const start = performance.now();
  const result = await next(params);
  const end = performance.now();
  
  const duration = end - start;
  if (duration > 100) {
    console.warn(`Slow query in ${params.model}.${params.action}: ${duration}ms`);
    console.warn('Query params:', params);
  }
  
  return result;
});

// Soft delete middleware
prisma.$use(async (params, next) => {
  if (params.action === 'delete') {
    // Convert delete operations to updates
    params.action = 'update';
    params.args.data = { deleted: true, deletedAt: new Date() };
  }
  if (params.action === 'deleteMany') {
    // Convert deleteMany operations to updateMany
    params.action = 'updateMany';
    params.args.data = { deleted: true, deletedAt: new Date() };
  }
  return next(params);
});

// Audit logging middleware
prisma.$use(async (params, next) => {
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
});

// Cache middleware
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute

prisma.$use(async (params, next) => {
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
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;