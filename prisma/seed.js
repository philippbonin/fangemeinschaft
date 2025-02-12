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
        logoUrl: '/Logo/defaultLogo.png',
        chatEnabled: true,
        buildLabelEnabled: true
      }
    });

    // Create sample news
    const news = [
      {
        title: 'Anpfiff für die neue Website von Fangemeinschaft.de!',
        content: 'Liebe Fußballfans, Vereinsfreunde und Supporter,\n\n der Schlusspfiff für die alte Seite ist ertönt – und jetzt startet der große Anstoß in eine neue digitale Ära! \n Fangemeinschaft.de hat ein frisches Trikot übergestreift und präsentiert sich in einem völlig neuen Design. Ab sofort findet ihr auf unserer neuen Website alles, was das Fanherz höherschlagen lässt – übersichtlicher, moderner und noch näher am Spielgeschehen! \n\n ⚽ Spielplan & Events: Verpasst keine Fan-Treffen, Auswärtsfahrten oder Sonderaktionen mehr! \n 📢 Fan-News & Blog: Exklusive Geschichten rund um eure Vereine und die Fankultur. \n\n Schaut vorbei, klickt euch durch und gebt uns gerne Feedback – denn eure Meinung zählt! \nBesucht uns unter www.fangemeinschaft.de und erlebt die neue Heimat der Fanszene. \n\n Gemeinsam auf den Rängen, gemeinsam online – wir sind bereit für die nächste Saison! \n Auf die Fankultur – und auf euch! \n\n Euer Team von Fangemeinschaft.de',
        image: '/News/defaultNews.jpg',
        category: 'Match Report',
        date: new Date()
      }
    ];

    for (const item of news) {
      await prisma.news.create({ data: item });
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

