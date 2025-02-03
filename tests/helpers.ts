import { prisma } from '../src/lib/prisma';
import { hash } from 'bcryptjs';

export async function createTestUser() {
  return prisma.user.create({
    data: {
      email: 'test@example.com',
      password: await hash('password123', 10),
      firstName: 'Test',
      lastName: 'User'
    }
  });
}

export async function cleanupTestData() {
  await prisma.user.deleteMany();
  await prisma.news.deleteMany();
  await prisma.match.deleteMany();
  await prisma.player.deleteMany();
  await prisma.fanclub.deleteMany();
  await prisma.formation.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.settings.deleteMany();
}

export async function createTestData() {
  const user = await createTestUser();
  
  const news = await prisma.news.create({
    data: {
      title: 'Test News',
      content: 'Test content',
      image: 'https://example.com/test.jpg',
      category: 'Test',
      date: new Date()
    }
  });

  const match = await prisma.match.create({
    data: {
      date: new Date(),
      competition: 'Test League',
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      venue: 'Test Stadium',
      played: false
    }
  });

  return { user, news, match };
}