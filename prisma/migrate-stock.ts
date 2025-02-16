import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateStock() {
  // Step 1: Create missing locations
  const locations = await prisma.product.findMany({
    where: { location: { not: null } },
    select: { location: true },
    distinct: ["location"],
  });

  for (const { location } of locations) {
    await prisma.location.upsert({
      where: { name: location! },
      update: {},
      create: { name: location },
    });
  }

  // Step 2: Migrate stock
  const products = await prisma.product.findMany({
    where: {
      qtyInStock: { gt: 0 },
      AND: [{ location: { not: null } }, { location: { not: "" } }],
    },
    select: { id: true, qtyInStock: true, location: true },
  });

  for (const product of products) {
    const location = await prisma.location.findUnique({
      where: { name: product.location! },
      select: { id: true },
    });

    if (location) {
      await prisma.stock.create({
        data: {
          productId: product.id,
          qty: product.qtyInStock,
          locationId: location.id,
        },
      });
    }
  }
}

migrateStock()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
