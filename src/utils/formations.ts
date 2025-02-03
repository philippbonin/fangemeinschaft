import { prisma } from '../lib/prisma';
import type { Formation, FormationPlayer } from '@prisma/client';

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

export async function createFormation(data: {
  matchId: string;
  players: Array<{
    playerId: string;
    positionX: number;
    positionY: number;
  }>;
}): Promise<Formation> {
  return prisma.formation.create({
    data: {
      matchId: data.matchId,
      players: {
        create: data.players.map(p => ({
          playerId: p.playerId,
          positionX: p.positionX,
          positionY: p.positionY
        }))
      }
    },
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

export async function updateFormation(id: string, data: {
  players?: Array<{
    playerId: string;
    positionX: number;
    positionY: number;
  }>;
  active?: boolean;
}): Promise<Formation> {
  return prisma.$transaction(async (tx) => {
    if (data.players) {
      // Delete existing player positions
      await tx.formationPlayer.deleteMany({
        where: { formationId: id }
      });

      // Create new player positions
      await tx.formationPlayer.createMany({
        data: data.players.map(p => ({
          formationId: id,
          playerId: p.playerId,
          positionX: p.positionX,
          positionY: p.positionY
        }))
      });
    }

    if (data.active) {
      // Deactivate all other formations
      await tx.formation.updateMany({
        where: { id: { not: id } },
        data: { active: false }
      });
    }

    // Update formation
    return tx.formation.update({
      where: { id },
      data: { active: data.active },
      include: {
        match: true,
        players: {
          include: {
            player: true
          }
        }
      }
    });
  });
}

export async function deleteFormation(id: string): Promise<boolean> {
  try {
    await prisma.formation.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function setActiveFormation(id: string): Promise<void> {
  await prisma.$transaction([
    prisma.formation.updateMany({
      where: { active: true },
      data: { active: false }
    }),
    prisma.formation.update({
      where: { id },
      data: { active: true }
    })
  ]);
}