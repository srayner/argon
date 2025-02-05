import { PrismaClient } from "@prisma/client";
import { clearData } from "./clearData";

const prisma = new PrismaClient();

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

  for (const name of manufacturerNames) {
    await prisma.manufacturer.create({
      data: {
        name,
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

  for (const name of supplierNames) {
    await prisma.supplier.create({
      data: {
        name,
      },
    });
  }

  console.log("Suppliers have been seeded!");
}

// Function to seed locations with hierarchy (sequential creation)
async function seedLocations() {
  const garage = await prisma.location.create({
    data: {
      name: "Garage",
    },
  });

  const office = await prisma.location.create({
    data: {
      name: "Office",
    },
  });

  // Create draw locations sequentially
  for (let i = 0; i < 20; i++) {
    await prisma.location.create({
      data: {
        name: `Draw ${i + 1}`,
        parentId: garage.id,
      },
    });
  }

  // Create bin locations sequentially
  for (let i = 0; i < 10; i++) {
    await prisma.location.create({
      data: {
        name: `Bin ${100 + i}`,
        parentId: garage.id,
      },
    });
  }

  // Create tray locations sequentially
  for (let i = 0; i < 25; i++) {
    await prisma.location.create({
      data: {
        name: `Tray ${200 + i}`,
        parentId: office.id,
      },
    });
  }

  console.log("Locations with hierarchy have been seeded!");
}

async function seedCategories(
  hierarchy: any[],
  parentId: string | null = null
) {
  for (const category of hierarchy) {
    // Create the current category
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
        parentId: parentId, // Set parentId to the parent category's id
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
      await seedCategories(category.children, createdCategory.id); // Recursively seed child categories
    }
  }
}

// Main function to call all the seed functions
async function main() {
  await clearData();

  const categoryHierarchy = [
    {
      name: "Mechanical",
      children: [],
    },
    {
      name: "Electronic",
      children: [
        {
          name: "Resistors",
          children: [
            { name: "Through Hole Resistors", children: [] },
            { name: "Surface Mount Resistors", children: [] },
            { name: "Variable Resistors", children: [] },
          ],
        },
        { name: "Capacitors", children: [] },
        {
          name: "Semi-conductors",
          children: [
            {
              name: "Diodes",
              children: [
                { name: "Schottky Diodes", children: [] },
                { name: "LEDs", children: [] },
              ],
            },
          ],
        },
        {
          name: "Logic Gates",
          children: [{ name: "7400 Series Logic Chips", children: [] }],
        },
      ],
    },
    {
      name: "Connectors",
      children: [],
      properties: [
        { name: "Connector Type", type: "STRING" },
        { name: "Material", type: "STRING" },
      ],
    },
    {
      name: "Cable & Wire",
      children: [],
    },
  ];

  await seedManufacturers();
  await seedSuppliers();
  await seedLocations();
  await seedCategories(categoryHierarchy);

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
