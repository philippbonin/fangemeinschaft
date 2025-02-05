// src/utils/formations.ts
import prisma from '../lib/prisma';
import type { Formation, FormationPlayer } from '@prisma/client';
import type { Request } from 'astro';
import type { PrismaContext, PrismaArgs } from '../types/prisma';

export async function getFormations(): Promise<Formation[]> {
  return prisma.formation.findMany({
    include: {
      match: true,
      players: {
        include: {
          player: true
        }
      }
    },
    where: { deleted: false },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getFormationById(id: string): Promise<Formation | null> {
  return prisma.formation.findUnique({
    where: { id },
    include: {
      match: true,
      players: {
        include: {
          player: true
        }
      }
    }
  });
}

export async function createFormation(
  data: {
    matchId: string;
    players: Array<{
      playerId: string;
      positionX: number;
      positionY: number;
    }>;
  },
  request: Request
): Promise<Formation> {
  const ctx: PrismaContext = { req: request };
  const args: PrismaArgs = {
    data: {
      matchId: data.matchId,
      players: {
        create: data.players
      }
    },
    include: {
      match: true,
      players: {
        include: {
          player: true
        }
      }
    },
    _ctx: ctx
  };
  
  return prisma.formation.create(args);
}

export async function updateFormation(
  id: string,
  data: {
    players?: Array<{
      playerId: string;
      positionX: number;
      positionY: number;
    }>;
    active?: boolean;
  },
  request: Request
): Promise<Formation> {
  const ctx: PrismaContext = { req: request };

  return prisma.$transaction(async (tx) => {
    if (data.players) {
      await tx.formationPlayer.deleteMany({
        where: { formationId: id }
      });

      await tx.formationPlayer.createMany({
        data: data.players.map(p => ({
          formationId: id,
          ...p
        }))
      });
    }

    if (data.active) {
      await tx.formation.updateMany({
        where: { id: { not: id } },
        data: { active: false }
      });
    }

    const args: PrismaArgs = {
      where: { id },
      data: { active: data.active },
      include: {
        match: true,
        players: {
          include: {
            player: true
          }
        }
      },
      _ctx: ctx
    };

    return tx.formation.update(args);
  });
}

export async function deleteFormation(id: string, request: Request): Promise<boolean> {
  try {
    const ctx: PrismaContext = { req: request };
    const args: PrismaArgs = {
      where: { id },
      _ctx: ctx
    };

    await prisma.formation.delete(args);
    return true;
  } catch {
    return false;
  }
}

export async function setActiveFormation(id: string, request: Request): Promise<void> {
  const ctx: PrismaContext = { req: request };
  
  await prisma.$transaction([
    prisma.formation.updateMany({
      where: { active: true },
      data: { active: false },
      _ctx: ctx
    }),
    prisma.formation.update({
      where: { id },
      data: { active: true },
      _ctx: ctx
    })
  ]);
}
