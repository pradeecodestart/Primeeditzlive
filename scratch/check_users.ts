import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('=== REGISTERED DATABASE USERS ===');
  console.log(JSON.stringify(users, null, 2));
  console.log(`Total Registered Users: ${users.length}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
