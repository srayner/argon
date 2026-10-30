import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function clearData() {
  // Models should be cleared in the correct order, dependencies first.
  const models: (keyof PrismaClient)[] = [
    "stock",
    "propertyValue",
    "product",
    "property",
    "category",
    "location",
    "supplier",
    "manufacturer",
    "user",
    "account",
  ];

  for (const model of models) {
    await (prisma[model] as any).deleteMany({});
  }

  console.log("Data has been cleared!");
}

async function seedUsers() {
  console.log("User Password: ", process.env.USER_PASSWORD_USER);
  const hashedUserPassword = await bcrypt.hash(
    process.env.USER_PASSWORD_USER || "",
    10
  );
  const hashedAdminPassword = await bcrypt.hash(
    process.env.USER_PASSWORD_ADMIN || "",
    10
  );

  await prisma.user.createMany({
    data: [
      {
        name: "Example User",
        email: "user@example.com",
        password: hashedUserPassword,
        role: "USER",
      },
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedAdminPassword,
        role: "ADMIN",
      },
    ],
  });

  console.log("Users have been created with hashed passwords!");
}

function websiteFor(name: string) {
  return `https://www.${name.toLowerCase().replace(/\s+/g, "")}.example.com`;
}

async function seedManufacturers() {
  const adjectives = [
    "Titanic",
    "Solar",
    "Eagle",
    "Majestic",
    "Epic",
    "Vanguard",
    "Nova",
    "Prime",
    "Pinnacle",
    "Crest",
  ];
  const companyTypes = [
    "Engineering",
    "Solutions",
    "Industries",
    "Manufacturing",
    "Systems",
    "Technologies",
    "Group",
    "Works",
    "Enterprises",
  ];

  const manufacturerNames = Array.from({ length: 25 }, (_, i) => {
    const adjective = adjectives[i % adjectives.length];
    const companyType = companyTypes[i % companyTypes.length];
    return `${adjective} ${companyType}`;
  });

  manufacturerNames.push("acme works", "zenith group");

  for (const [i, name] of manufacturerNames.entries()) {
    await prisma.manufacturer.create({
      data: {
        name,
        website: i % 9 === 0 ? undefined : websiteFor(name),
      },
    });
  }

  console.log("Manufacturers have been seeded!");
}

async function seedSuppliers() {
  const adjectives = [
    "Global",
    "Advanced",
    "Prime",
    "Eco",
    "Rapid",
    "Peak",
    "Leading",
    "NextGen",
    "Innovative",
    "Elite",
  ];
  const companyTypes = [
    "Supplies",
    "Distribution",
    "Logistics",
    "Trading",
    "Exports",
    "Imports",
    "Solutions",
    "Partners",
    "Group",
    "Corporation",
  ];

  const supplierNames = Array.from({ length: 25 }, (_, i) => {
    const adjective = adjectives[i % adjectives.length];
    const companyType = companyTypes[i % companyTypes.length];
    return `${adjective} ${companyType}`;
  });

  supplierNames.push("acme supplies", "zenith traders");

  for (const [i, name] of supplierNames.entries()) {
    await prisma.supplier.create({
      data: {
        name,
        website: i % 9 === 0 ? undefined : websiteFor(name),
      },
    });
  }

  console.log("Suppliers have been seeded!");
}

async function seedLocations() {
  const garage = await prisma.location.create({
    data: { code: "GAR", name: "Garage" },
  });
  const office = await prisma.location.create({
    data: { code: "off", name: "Office" },
  });

  const attic = await prisma.location.create({ data: { name: "attic" } });
  const warehouse = await prisma.location.create({
    data: { code: "WH", name: "Warehouse" },
  });
  const workshop = await prisma.location.create({
    data: { code: "ws", name: "workshop" },
  });

  const children = [
    ...Array.from({ length: 2 }, (_, i) => ({
      code: `L${i + 1}`,
      name: `Loft Box ${i + 1}`,
      parentId: attic.id,
    })),
    ...Array.from({ length: 3 }, (_, i) => ({
      code: `P${i + 1}`,
      name: `Pallet ${i + 1}`,
      parentId: warehouse.id,
    })),
    ...Array.from({ length: 2 }, (_, i) => ({
      code: `w${i + 1}`,
      name: `Bench ${i + 1}`,
      parentId: workshop.id,
    })),
    ...Array.from({ length: 20 }, (_, i) => ({
      code: `D${i + 1}`,
      name: `Draw ${i + 1}`,
      parentId: garage.id,
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
      code: `B${100 + i}`,
      name: `Bin ${100 + i}`,
      parentId: garage.id,
    })),
    ...Array.from({ length: 25 }, (_, i) => ({
      code: i < 3 ? undefined : `T${200 + i}`,
      name: `Tray ${200 + i}`,
      parentId: office.id,
    })),
  ];

  for (const data of children) {
    await prisma.location.create({ data });
  }

  console.log("Locations with hierarchy have been seeded!");
}

async function seedCategories(
  hierarchy: any[],
  parentId: string | null = null,
  depth = 0
) {
  for (const category of hierarchy) {
    // Create the current category
    const createdCategory = await prisma.category.create({
      data: {
        code: category.code,
        name: category.name,
        status: category.status,
        parentId: parentId, // Set parentId to the parent category's id
        // Nothing in the app sets depth yet, so the seed does.
        depth: category.noDepth ? undefined : depth,
      },
    });

    console.log(`Category '${category.name}' created!`);

    // Create properties for the category
    if (category.properties && category.properties.length > 0) {
      for (const prop of category.properties) {
        await prisma.property.create({
          data: {
            name: prop.name,
            type: prop.type, // Using PropertyType enum
            units: prop.units || undefined,
            unitPosition: prop.unitPosition || undefined,
            categoryId: createdCategory.id, // Link property to category
          },
        });
        console.log(
          `Property '${prop.name}' created for category '${category.name}'`
        );
      }
    }

    // If the category has children, recursively create them
    if (category.children && category.children.length > 0) {
      await seedCategories(
        category.children,
        createdCategory.id,
        depth + 1
      ); // Recursively seed child categories
    }
  }
}

async function seedProducts() {
  const manufacturers = await prisma.manufacturer.findMany({});
  const suppliers = await prisma.supplier.findMany({});
  const categories = await prisma.category.findMany({});

  const productData = [
    {
      name: '8 x 3/8" PP/ST Zinc Screw',
      category: "Mechanical",
      supplier: "acme supplies",
      cost: 0.05,
      qtyInStock: 100,
    },
    {
      name: '8 x 1/2" PP/ST Zinc Screw',
      category: "Mechanical",
      manufacturer: "acme works",
      supplier: "Advanced Distribution",
      cost: 0.06,
      qtyInStock: 75,
    },
    {
      name: '8 x 3/4" PP/ST Zinc Screw',
      category: "Mechanical",
      manufacturer: "acme works",
      cost: 0.07,
      qtyInStock: 50,
    },
    {
      name: "SN74LS32 OR Gate",
      category: "Logic Gates",
      supplier: "Global Supplies",
      cost: 0.45,
      qtyInStock: 0,
    },
    {
      name: "Special Connector",
      category: "Connectors",
      manufacturer: "Solar Solutions",
      qtyInStock: 5,
    },
    {
      name: "100 Ohm Resistor",
      manufacturer: "Eagle Industries",
      supplier: "Global Supplies",
      category: "Through Hole Resistors",
      cost: 0.1,
      qtyInStock: 4,
    },
    {
      name: "220 Ohm Resistor",
      manufacturer: "Eagle Industries",
      supplier: "Global Supplies",
      category: "Through Hole Resistors",
      cost: 0.12,
      qtyInStock: 17,
    },
    {
      name: "330 Ohm Resistor",
      manufacturer: "Eagle Industries",
      supplier: "Global Supplies",
      category: "Through Hole Resistors",
      cost: 0.15,
      qtyInStock: 10,
    },
    {
      name: "470 Ohm Resistor",
      manufacturer: "Eagle Industries",
      supplier: "Global Supplies",
      category: "Through Hole Resistors",
      cost: 0.2,
      qtyInStock: 9,
    },
    {
      name: "m3 nylon washer",
      category: "Mechanical",
      manufacturer: "zenith group",
      supplier: "zenith traders",
      cost: 0.02,
      qtyInStock: 250,
    },
    {
      name: "zip tie 200mm",
      supplier: "Global Supplies",
      qtyInStock: 40,
    },
  ];

  for (const product of productData) {
    const data = {
      name: product.name,
      qtyInStock: product.qtyInStock,
      cost: product.cost,
      categoryId: findIdByName(categories, product.category),
      supplierId: findIdByName(suppliers, product.supplier),
      manufacturerId: findIdByName(manufacturers, product.manufacturer),
    };
    await prisma.product.create({ data });

    console.log(`Product '${product.name}' created`);
  }
}

function findIdByName<T extends { id: string | number; name?: string | null }>(
  array: T[],
  name: string | undefined
): T["id"] | null {
  const result = array.find((entity) => entity.name === name);
  return result ? result.id : null;
}

// Seeds stock in the child locations and sets each location's productCount from it.
async function seedStock() {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  const locations = await prisma.location.findMany({
    where: { parentId: { not: null } },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });

  for (const [i, location] of locations.entries()) {
    const productsHere = i < 2 ? 1 : i % 13 === 5 ? 3 : 2;
    let count = 0;

    for (let k = 0; k < productsHere; k++) {
      const product = products[(i * 3 + k) % products.length];

      // The stock e2e spec adds this one itself.
      if (location.name === "Bin 103" && product.name === "100 Ohm Resistor") {
        continue;
      }

      await prisma.stock.create({
        data: {
          locationId: location.id,
          productId: product.id,
          qty: 1 + ((i + k * 7) % 50),
        },
      });
      count++;
    }

    await prisma.location.update({
      where: { id: location.id },
      data: { productCount: count },
    });
  }

  console.log("Stock has been seeded!");
}

async function main() {
  const categoryHierarchy = [
    {
      name: "Mechanical",
      code: "MECH",
      children: [
        // Lower case names, to check sorting is not case sensitive.
        { name: "adhesives", children: [] },
        { name: "washers", children: [] },
        {
          name: "Screws",
          code: "SCR",
          properties: [
            { name: "Drive Type", type: "STRING" },
            { name: "Head Type", type: "STRING" },
            { name: "Thread", type: "NUMERIC" },
            { name: "Length", type: "IMPERIAL" },
          ],
        },
      ],
    },
    {
      name: "Electronic",
      code: "ELEC",
      children: [
        {
          name: "Resistors",
          code: "RES",
          children: [
            {
              name: "Through Hole Resistors",
              code: "THR",
              children: [],
              properties: [
                { name: "Resistance", type: "METRIC", units: "Ω" },
                { name: "Power Rating", type: "METRIC", units: "W" },
                { name: "Type", type: "STRING" },
                { name: "Pack Qty", type: "NUMERIC" },
                { name: "Lead Diameter", type: "NUMERIC", units: "mm" },
                {
                  name: "Prefix",
                  type: "NUMERIC",
                  units: "#",
                  unitPosition: "PREFIX",
                },
              ],
            },
            { name: "Surface Mount Resistors", code: "SMR", children: [] },
            { name: "Variable Resistors", noDepth: true, children: [] },
          ],
        },
        { name: "Capacitors", code: "cap", status: "INACTIVE", children: [] },
        {
          name: "Semi-conductors",
          code: "SEMI",
          children: [
            {
              name: "Diodes",
              code: "DIO",
              children: [
                { name: "Schottky Diodes", children: [] },
                { name: "LEDs", children: [] },
              ],
            },
          ],
        },
        {
          name: "Logic Gates",
          code: "LOG",
          children: [{ name: "7400 Series Logic Chips", children: [] }],
        },
      ],
    },
    {
      name: "Connectors",
      code: "CONN",
      children: [],
      properties: [
        { name: "Connector Type", type: "STRING" },
        { name: "Material", type: "STRING" },
      ],
    },
    {
      name: "Cable & Wire",
      noDepth: true,
      children: [],
    },
    { name: "tools", code: "tl", children: [] },
  ];

  await clearData();
  await seedManufacturers();
  await seedSuppliers();
  await seedLocations();
  await seedCategories(categoryHierarchy);
  await seedProducts();
  await seedStock();
  await seedUsers();

  console.log("All data has been seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
