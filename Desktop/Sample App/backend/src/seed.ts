import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma.js";

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "sample";
  const password = process.env.ADMIN_PASSWORD ?? "sample";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: "System Admin",
      passwordHash,
      role: "ADMIN",
    },
    update: {
      passwordHash,
      role: "ADMIN",
    },
  });

  const products = [
    {
      sku: "RET-1001",
      name: "Cotton T-Shirt",
      category: "Apparel",
      unitPrice: 19.99,
      costPrice: 8.5,
      stockQty: 120,
      reorderLevel: 25,
      warehouse: "Retail Store A",
      description: "Basic retail apparel item",
    },
    {
      sku: "RET-1002",
      name: "Wireless Mouse",
      category: "Electronics",
      unitPrice: 29.5,
      costPrice: 14,
      stockQty: 80,
      reorderLevel: 15,
      warehouse: "Main Warehouse",
      description: "POS and retail ready electronics",
    },
    {
      sku: "WHL-2001",
      name: "Bulk Paper Carton",
      category: "Stationery",
      unitPrice: 45,
      costPrice: 28,
      stockQty: 240,
      reorderLevel: 40,
      warehouse: "Wholesale Depot",
      description: "Wholesale carton pack",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      create: product,
      update: product,
    });
  }

  await prisma.customer.upsert({
    where: { code: "CUS-001" },
    create: {
      code: "CUS-001",
      name: "City Retail Mart",
      email: "buyer@citymart.example",
      phone: "+1-555-0101",
      type: "retail",
      creditLimit: 5000,
    },
    update: { name: "City Retail Mart" },
  });

  await prisma.supplier.upsert({
    where: { code: "SUP-001" },
    create: {
      code: "SUP-001",
      name: "Global Supplies Co",
      email: "orders@globalsupplies.example",
      phone: "+1-555-0202",
      leadTimeDays: 5,
    },
    update: { name: "Global Supplies Co" },
  });

  console.log(`Admin ready: ${email}`);
  console.log("Sample products, customer, and supplier seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
