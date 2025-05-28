import myData from './my-data';
import { log } from 'console';
import { prisma } from './prisma';

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: myData.products });

  log('Database seeded successfully with sample data.');
}

main();
