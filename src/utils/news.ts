// src/utils/news.ts
import prisma from '../lib/prisma';
import type { News } from '@prisma/client';
import type { Request } from 'astro';
import type { PrismaContext, PrismaArgs } from '../types/prisma';

export async function getNews(): Promise<News[]> {
  return prisma.news.findMany({
    orderBy: { date: 'desc' },
    where: { deleted: false }
  });
}

export async function getNewsById(id: string): Promise<News | null> {
  return prisma.news.findUnique({
    where: { id }
  });
}

export async function createNews(
  data: Omit<News, 'id' | 'createdAt' | 'updatedAt' | 'deleted' | 'deletedAt'>,
  request: Request
): Promise<News> {
  const ctx: PrismaContext = { req: request };
  const args: PrismaArgs = {
    data,
    _ctx: ctx
  };
  
  return prisma.news.create(args);
}

export async function updateNews(
  id: string, 
  data: Partial<News>,
  request: Request
): Promise<News | null> {
  const ctx: PrismaContext = { req: request };
  const args: PrismaArgs = {
    where: { id },
    data,
    _ctx: ctx
  };

  return prisma.news.update(args);
}

export async function deleteNews(id: string, request: Request): Promise<boolean> {
  try {
    const ctx: PrismaContext = { req: request };
    const args: PrismaArgs = {
      where: { id },
      _ctx: ctx
    };

    await prisma.news.delete(args);
    return true;
  } catch {
    return false;
  }
}
