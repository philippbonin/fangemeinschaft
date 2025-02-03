import { prisma } from '../lib/prisma';
import type { Settings } from '@prisma/client';

export async function getSettings(): Promise<Settings> {
  const settings = await prisma.settings.findFirst();
  
  if (!settings) {
    // Create default settings if none exist
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

export async function updateSettings(data: Partial<Settings>): Promise<Settings> {
  const settings = await prisma.settings.findFirst();
  
  if (!settings) {
    return prisma.settings.create({
      data: {
        logoUrl: data.logoUrl || '/fangemeinschaftLogo.png',
        chatEnabled: data.chatEnabled ?? true,
        buildLabelEnabled: data.buildLabelEnabled ?? true
      }
    });
  }

  return prisma.settings.update({
    where: { id: settings.id },
    data
  });
}