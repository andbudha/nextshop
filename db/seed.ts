import { PrismaClient } from '@/lib/generated/prisma';
import myData from './my-data';
import { log } from 'console';

async function main() {
  const prisma = new PrismaClient();
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: myData.products });

  log('Database seeded successfully with sample data.');
}

main();
