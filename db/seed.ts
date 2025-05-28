import myData from './my-data';
import { log } from 'console';
import { prisma } from './prisma';

async function main() {
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();

  await prisma.product.createMany({ data: myData.products });
  await prisma.user.createMany({ data: myData.users });

  log('Database seeded successfully with sample data.');
}

main();
