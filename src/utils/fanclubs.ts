import { prisma } from '../lib/prisma';
import type { Fanclub } from '@prisma/client';

export async function getFanclubs(): Promise<Fanclub[]> {
  return prisma.fanclub.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function getFanclubById(id: string): Promise<Fanclub | null> {
  return prisma.fanclub.findUnique({
    where: { id }
  });
}

export async function createFanclub(data: Omit<Fanclub, 'id' | 'createdAt' | 'updatedAt'>): Promise<Fanclub> {
  return prisma.fanclub.create({ data });
}

export async function updateFanclub(id: string, data: Partial<Fanclub>): Promise<Fanclub | null> {
  return prisma.fanclub.update({
    where: { id },
    data
  });
}

export async function deleteFanclub(id: string): Promise<boolean> {
  try {
    await prisma.fanclub.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}