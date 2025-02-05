import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function clearData() {
  // Models should be cleared in the correct order, dependencies first.
  const models: (keyof PrismaClient)[] = [
    "propertyValue",
    "product",
    "property",
    "category",
    "location",
    "supplier",
    "manufacturer",
  ];

  for (const model of models) {
    await (prisma[model] as any).deleteMany({});
  }

  console.log("Data has been cleared!");
}

clearData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
