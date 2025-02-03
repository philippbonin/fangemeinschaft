import { prisma } from '../lib/prisma';
import type { Match } from '@prisma/client';

export async function getMatches(): Promise<Match[]> {
  return prisma.match.findMany({
    orderBy: { date: 'desc' }
  });
}

export async function getMatchById(id: string): Promise<Match | null> {
  return prisma.match.findUnique({
    where: { id }
  });
}

export async function createMatch(data: Omit<Match, 'id' | 'createdAt' | 'updatedAt'>): Promise<Match> {
  return prisma.match.create({ data });
}

export async function updateMatch(id: string, data: Partial<Match>): Promise<Match | null> {
  return prisma.match.update({
    where: { id },
    data
  });
}

export async function deleteMatch(id: string): Promise<boolean> {
  try {
    await prisma.match.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}