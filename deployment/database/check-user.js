import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserExists() {
    const user = await prisma.user.findUnique({
        where: { email: 'admin@fangemeinschaft.de' }
    });

    if (user) {
        console.log("User exists");
        process.exit(0); // Exit with success code
    } else {
        console.log("User does not exist");
        process.exit(1); // Exit with failure code
    }
}

checkUserExists().catch((e) => {
    console.error("Error checking user:", e);
    process.exit(1);
});
