import { PrismaClient } from '@prisma/client';
import {
  withLogging,
  withAuditLog,
  withAuthentication,
  withRateLimit,
  withCache,
  withSoftDelete,
} from './prismaMiddleware'; // Import middleware functions

const prisma = new PrismaClient();

// 🔒 Enforce Authentication Middleware (Restored!)
prisma.$use(async (params, next) => {
  if (['create', 'update', 'delete'].includes(params.action)) {
    const userToken = params.args?.token;
    if (!userToken) throw new Error('Unauthorized');

    const user = await verifyToken(userToken);
    if (!user) throw new Error('Invalid or expired token');

    params.args.data.modifiedBy = user.userId; // Track who made changes
  }
  return next(params);
});

// Attach middlewares
prisma.$use(withLogging);
prisma.$use(withAuthentication);
prisma.$use(withAuditLog);
prisma.$use(withRateLimit(100, 60 * 60)); // 100 requests per hour
prisma.$use(withCache());
prisma.$use(withSoftDelete());

export default prisma;
