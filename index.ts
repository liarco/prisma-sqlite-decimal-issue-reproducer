import { PrismaClient } from '@prisma/client'
import Decimal from 'decimal.js';

const prisma = new PrismaClient()

const numbers = [
  0.2,
  0.06302,
  0.0637,
  0.063825,
  0.00785355,
  0.0005108,
  0.06345,
  0.06345,
  0.06363,
  0.06327,
  0.06366,
  0.06391,
  0.063369,
  0.062828,
  0.00998965,
  0.06295,
  0.0628,
  0.0628,
  0.062937,
  0.00994088,
];

async function main() {
  await prisma.decimalValue.deleteMany({});

  const dataComparison: any = [];

  for (let myValue of numbers) {
    const result = await prisma.decimalValue.create({
      data: {
        myValue,
      },
    });

    dataComparison.push({
      'Original': myValue,
      'PRISMA': result.myValue,
      'new Decimal()': new Decimal(result.myValue.toNumber()),
    });
  }

  console.table(dataComparison, ['Original', 'PRISMA', 'new Decimal()'])
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
