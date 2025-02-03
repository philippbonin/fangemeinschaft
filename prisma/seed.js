import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('4rfvVGZ/1984', 10);
    await prisma.user.upsert({
      where: { email: 'admin@fangemeinschaft.de' },
      update: {},
      create: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@fangemeinschaft.de',
        password: hashedPassword
      }
    });

    // Create initial settings
    await prisma.settings.upsert({
      where: { id: '1' },
      update: {},
      create: {
        logoUrl: '/fangemeinschaftLogo.png',
        chatEnabled: true,
        buildLabelEnabled: true
      }
    });

    // Create sample players
    const players = [
      { id:"1", name: 'Max Müller', number: 1, position: 'Goalkeeper', image: '/players/max-mueller.jpg' },
      { id:"2", name: 'Thomas Schmidt', number:2, position: 'Defender', image: '/players/thomas-schmidt.jpg' },
      { id:"3", name: 'Lars Weber', number: 4, position: 'Defender', image: '/players/lars-weber.jpg' }
    ];

    for (const player of players) {
      await prisma.player.upsert({
        where: { id: player.id },
        update: {},
        create: player
      });
    }

    // Create sample news
    const news = [
      {
        title: 'Wichtiger Sieg im Heimspiel',
        content: 'Die Mannschaft konnte einen wichtigen 2:1 Sieg erringen...',
        image: '/news/victory.jpg',
        category: 'Match Report',
        date: new Date()
      }
    ];

    for (const item of news) {
      await prisma.news.create({ data: item });
    }

    // Create sample matches
    const matches = [
      {
        date: new Date('2024-03-15T15:30:00Z'),
        competition: 'Bundesliga',
        homeTeam: 'SC Freiburg',
        awayTeam: 'Bayern München',
        venue: 'Europa-Park Stadion',
        played: false
      }
    ];

    for (const match of matches) {
      await prisma.match.create({ data: match });
    }

    // Create sample fanclubs
    const fanclubs = [
      {
        name: 'Breisgau Brasilianer',
        president: 'Hans Schmidt',
        phone: '0761-123456',
        email: 'info@breisgau-brasilianer.de',
        website: 'https://breisgau-brasilianer.de'
      }
    ];

    for (const fanclub of fanclubs) {
      await prisma.fanclub.create({ data: fanclub });
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
