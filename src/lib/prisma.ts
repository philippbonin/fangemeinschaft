import { PrismaClient } from '@prisma/client';
import { withLogging, withAuthentication, withAuditLog, withRateLimit, withCache, withSoftDelete } from './prismaMiddleware';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
  ],
});

// Attach middlewares
prisma.$use(withLogging);
prisma.$use(withAuthentication);
prisma.$use(withAuditLog);
prisma.$use(withRateLimit(100, 60 * 60)); // 100 requests per hour
prisma.$use(withCache);
prisma.$use(withSoftDelete);

// Log queries in development
if (process.env.NODE_ENV !== 'production') {
  prisma.$on('query', (e) => {
    console.log('Query: ' + e.query);
    console.log('Duration: ' + e.duration + 'ms');
  });

  prisma.$on('error', (e) => {
    console.error('Prisma Error:', e.message);
  });

  globalThis.prisma = prisma;
}

export default prisma;