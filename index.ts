import { PrismaClient } from '@prisma/client'
import Decimal from 'decimal.js';

const prisma = new PrismaClient()

const numbers = [
  0.1,
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
      'new Decimal()': new Decimal(result.myValue),
    });
  }

  console.table(dataComparison, ['Original', 'PRISMA', 'new Decimal()'])

  // Is it safe to use FLOAT in SQLite?
  // Testing solution from https://github.com/prisma/prisma/issues/20635#issuecomment-1673299083
  console.log([
    [
      // Sum 0.1 + 0.2 with pure "number" values
      dataComparison[0]['PRISMA'],
      dataComparison[1]['PRISMA'],
      dataComparison[0]['PRISMA'] + dataComparison[1]['PRISMA'],
    ],
    [
      // Sum 0.1 + 0.2 converting all values to DecimalJS
      new Decimal(dataComparison[0]['PRISMA']),
      new Decimal(dataComparison[1]['PRISMA']),
      (new Decimal(dataComparison[0]['PRISMA'])).add(new Decimal(dataComparison[1]['PRISMA'])),
    ],
    [
      // Sum 0.1 + 0.2 converting AT LEAST ONE value to DecimalJS
      new Decimal(dataComparison[0]['PRISMA']),
      new Decimal(dataComparison[1]['PRISMA']),
      (new Decimal(dataComparison[0]['PRISMA'])).add(dataComparison[1]['PRISMA']),
    ],
  ]);
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
