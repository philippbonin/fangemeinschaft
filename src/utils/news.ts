import { prisma } from '../lib/prisma';
import type { News } from '@prisma/client';

export async function getNews(): Promise<News[]> {
  return prisma.news.findMany({
    orderBy: { date: 'desc' }
  });
}

export async function getNewsById(id: string): Promise<News | null> {
  return prisma.news.findUnique({
    where: { id }
  });
}

export async function createNews(data: Omit<News, 'id' | 'createdAt' | 'updatedAt'>): Promise<News> {
  return prisma.news.create({ data });
}

export async function updateNews(id: string, data: Partial<News>): Promise<News | null> {
  return prisma.news.update({
    where: { id },
    data
  });
}

export async function deleteNews(id: string): Promise<boolean> {
  try {
    await prisma.news.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}