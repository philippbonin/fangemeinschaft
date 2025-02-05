// src/utils/team.ts
import prisma from '../lib/prisma';
import type { Player } from '@prisma/client';
import type { Request } from 'astro';
import type { PrismaContext, PrismaArgs } from '../types/prisma';

export async function getPlayers(): Promise<Player[]> {
  return prisma.player.findMany({
    orderBy: { number: 'asc' },
    where: { deleted: false }
  });
}

export async function getPlayerById(id: string): Promise<Player | null> {
  return prisma.player.findUnique({
    where: { id }
  });
}

export async function createPlayer(
  data: Omit<Player, 'id' | 'createdAt' | 'updatedAt' | 'deleted' | 'deletedAt'>,
  request: Request
): Promise<Player> {
  const ctx: PrismaContext = { req: request };
  const args: PrismaArgs = {
    data,
    _ctx: ctx
  };
  
  return prisma.player.create(args);
}

export async function updatePlayer(
  id: string,
  data: Partial<Player>,
  request: Request
): Promise<Player | null> {
  const ctx: PrismaContext = { req: request };
  const args: PrismaArgs = {
    where: { id },
    data,
    _ctx: ctx
  };

  return prisma.player.update(args);
}

export async function deletePlayer(id: string, request: Request): Promise<boolean> {
  try {
    const ctx: PrismaContext = { req: request };
    const args: PrismaArgs = {
      where: { id },
      _ctx: ctx
    };

    await prisma.player.delete(args);
    return true;
  } catch {
    return false;
  }
}
