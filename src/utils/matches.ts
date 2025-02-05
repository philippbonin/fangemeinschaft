// src/utils/matches.ts
import prisma from '../lib/prisma';
import type { Match } from '@prisma/client';
import type { Request } from 'astro';
import type { PrismaContext, PrismaArgs } from '../types/prisma';

export async function getMatches(): Promise<Match[]> {
  return prisma.match.findMany({
    where: { deleted: false },
    orderBy: { date: 'desc' }
  });
}

export async function getMatchById(id: string): Promise<Match | null> {
  return prisma.match.findUnique({
    where: { id }
  });
}

export async function createMatch(
  data: Omit<Match, 'id' | 'createdAt' | 'updatedAt' | 'deleted' | 'deletedAt'>,
  request: Request
): Promise<Match> {
  const ctx: PrismaContext = { req: request };
  const args: PrismaArgs = {
    data,
    _ctx: ctx
  };
  
  return prisma.match.create(args);
}

export async function updateMatch(
  id: string,
  data: Partial<Match>,
  request: Request
): Promise<Match | null> {
  const ctx: PrismaContext = { req: request };
  const args: PrismaArgs = {
    where: { id },
    data,
    _ctx: ctx
  };

  return prisma.match.update(args);
}

export async function deleteMatch(id: string, request: Request): Promise<boolean> {
  try {
    const ctx: PrismaContext = { req: request };
    const args: PrismaArgs = {
      where: { id },
      _ctx: ctx
    };

    await prisma.match.delete(args);
    return true;
  } catch {
    return false;
  }
}
