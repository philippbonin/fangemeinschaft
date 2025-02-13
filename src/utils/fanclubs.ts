// src/utils/fanclubs.ts
import prisma from '../lib/prisma';
import type { Fanclub } from '@prisma/client';
import type { Request } from 'astro';
import type { PrismaContext, PrismaArgs } from '../types/prisma';

export async function getFanclubs(): Promise<Fanclub[]> {
  return prisma.fanclub.findMany({
    orderBy: { name: 'asc' },
    where: { deleted: false }
  });
}

export async function getFanclubById(id: string): Promise<Fanclub | null> {
  return prisma.fanclub.findUnique({
    where: { id }
  });
}

export async function createFanclub(
  data: Omit<Fanclub, 'id' | 'createdAt' | 'updatedAt' | 'deleted' | 'deletedAt'>,
  request: Request
): Promise<Fanclub> {
  const ctx: PrismaContext = { req: request };
  const args: PrismaArgs = {
    data,
    _ctx: ctx
  };
  
  return prisma.fanclub.create(args);
}

export async function updateFanclub(
  id: string,
  data: Partial<Fanclub>,
  request: Request
): Promise<Fanclub | null> {
  const ctx: PrismaContext = { req: request };
  const args: PrismaArgs = {
    where: { id },
    data,
    _ctx: ctx
  };

  return prisma.fanclub.update(args);
}

export async function deleteFanclub(id: string, request: Request): Promise<boolean> {
  try {
    const ctx: PrismaContext = { req: request };
    const args: PrismaArgs = {
      where: { id },
      _ctx: ctx
    };

    await prisma.fanclub.delete(args);
    return true;
  } catch {
    return false;
  }
}
