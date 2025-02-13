import prisma from '../lib/prisma';
import type { Asset } from '@prisma/client';
import type { Request } from 'astro';
import type { PrismaContext, PrismaArgs } from '../types/prisma';

export async function getAssets(): Promise<Asset[]> {
  return prisma.asset.findMany({
    orderBy: { createdAt: 'desc' },
    where: { deleted: false }
  });
}

export async function getAssetById(id: string): Promise<Asset | null> {
  return prisma.asset.findUnique({
    where: { id }
  });
}

export function getAssetUrl(id: string): string {
  return `/api/assets/${id}`;
}

export async function createAsset(
  data: {
    name: string;
    data: Buffer;
    mimeType: string;
    size: number;
  },
  request: Request
): Promise<Asset> {
  const ctx: PrismaContext = { req: request };
  const args: PrismaArgs = {
    data,
    _ctx: ctx
  };
  
  return prisma.asset.create(args);
}

export async function deleteAsset(id: string, request: Request): Promise<boolean> {
  try {
    const ctx: PrismaContext = { req: request };
    const args: PrismaArgs = {
      where: { id },
      _ctx: ctx
    };

    await prisma.asset.delete(args);
    return true;
  } catch {
    return false;
  }
}