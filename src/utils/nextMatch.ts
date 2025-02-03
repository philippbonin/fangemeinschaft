import { prisma } from '../lib/prisma';
import type { NextMatch, NextMatchHistory } from '@prisma/client';

export async function getNextMatch(): Promise<NextMatch | null> {
  return prisma.nextMatch.findFirst({
    where: { active: true },
    include: {
      match: true
    }
  });
}

export async function getNextMatchHistory(): Promise<NextMatchHistory[]> {
  return prisma.nextMatchHistory.findMany({
    include: {
      match: true
    },
    orderBy: { activatedAt: 'desc' }
  });
}

export async function updateNextMatch(data: {
  id: string;
  ticketLink?: string;
  moreInfoContent?: string;
}): Promise<NextMatch | null> {
  return prisma.nextMatch.update({
    where: { id: data.id },
    data: {
      ticketLink: data.ticketLink,
      moreInfoContent: data.moreInfoContent
    },
    include: {
      match: true
    }
  });
}

export async function setActiveNextMatch(id: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Get current active match
    const currentActive = await tx.nextMatch.findFirst({
      where: { active: true }
    });

    if (currentActive) {
      // Add to history
      await tx.nextMatchHistory.create({
        data: {
          matchId: currentActive.matchId,
          ticketLink: currentActive.ticketLink,
          moreInfoContent: currentActive.moreInfoContent,
          activatedAt: currentActive.createdAt,
          deactivatedAt: new Date()
        }
      });

      // Deactivate current
      await tx.nextMatch.update({
        where: { id: currentActive.id },
        data: { active: false }
      });
    }

    // Activate new match
    await tx.nextMatch.update({
      where: { id },
      data: { active: true }
    });
  });
}