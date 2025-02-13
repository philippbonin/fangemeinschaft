// src/utils/settings.ts
import prisma from '../lib/prisma';
import type { Settings } from '@prisma/client';
import type { Request } from 'astro';
import type { PrismaContext, PrismaArgs } from '../types/prisma';

export async function getSettings(): Promise<Settings> {
  const settings = await prisma.settings.findFirst({
    where: { deleted: false }
  });
  
  if (!settings) {
    return prisma.settings.create({
      data: {
        logoUrl: '/fangemeinschaftLogo.png',
        chatEnabled: true,
        buildLabelEnabled: true
      }
    });
  }

  return settings;
}

export async function updateSettings(
  data: Partial<Settings>,
  request: Request
): Promise<Settings> {
  const ctx: PrismaContext = { req: request };
  const settings = await prisma.settings.findFirst({
    where: { deleted: false }
  });
  
  if (!settings) {
    const args: PrismaArgs = {
      data: {
        logoUrl: data.logoUrl || '/fangemeinschaftLogo.png',
        chatEnabled: data.chatEnabled ?? true,
        buildLabelEnabled: data.buildLabelEnabled ?? true
      },
      _ctx: ctx
    };
    return prisma.settings.create(args);
  }

  const args: PrismaArgs = {
    where: { id: settings.id },
    data,
    _ctx: ctx
  };
  return prisma.settings.update(args);
}
