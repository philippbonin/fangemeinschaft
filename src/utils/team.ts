import { prisma } from '../lib/prisma';
import type { Player } from '@prisma/client';

export async function getPlayers(): Promise<Player[]> {
  return prisma.player.findMany({
    orderBy: { number: 'asc' }
  });
}

export async function getPlayerById(id: string): Promise<Player | null> {
  return prisma.player.findUnique({
    where: { id }
  });
}

export async function createPlayer(data: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>): Promise<Player> {
  return prisma.player.create({ data });
}

export async function updatePlayer(id: string, data: Partial<Player>): Promise<Player | null> {
  return prisma.player.update({
    where: { id },
    data
  });
}

export async function deletePlayer(id: string): Promise<boolean> {
  try {
    await prisma.player.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}