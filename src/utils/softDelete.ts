import { prisma } from '../lib/prisma';

export async function restoreRecord(model: string, id: string) {
  if (model === 'Asset') {
    throw new Error('Cannot restore Asset - hard delete only');
  }

  return prisma[model].update({
    where: { id },
    data: {
      deleted: false,
      deletedAt: null
    }
  });
}
