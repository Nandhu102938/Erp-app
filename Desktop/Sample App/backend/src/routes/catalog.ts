import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();

const productSchema = z.object({
  sku: z.string().min(2),
  name: z.string().min(2),
  category: z.string().min(2),
  unitPrice: z.coerce.number().min(0),
  costPrice: z.coerce.number().min(0).optional().default(0),
  stockQty: z.coerce.number().int().min(0).optional().default(0),
  reorderLevel: z.coerce.number().int().min(0).optional().default(10),
  warehouse: z.string().optional().default("Main Warehouse"),
  status: z.string().optional().default("active"),
  description: z.string().optional().default(""),
});

const customerSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().default(""),
  type: z.string().optional().default("retail"),
  creditLimit: z.coerce.number().min(0).optional().default(0),
  status: z.string().optional().default("active"),
});

const supplierSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().default(""),
  leadTimeDays: z.coerce.number().int().min(0).optional().default(7),
  status: z.string().optional().default("active"),
});

router.get("/products", async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return res.json(products);
});

router.post("/products", async (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid product payload.", issues: parsed.error.flatten() });
  }

  const product = await prisma.product.create({ data: parsed.data });
  return res.status(201).json(product);
});

router.put("/products/:id", async (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid product payload.", issues: parsed.error.flatten() });
  }

  const product = await prisma.product.update({
    where: { id: String(req.params.id) },
    data: parsed.data,
  });
  return res.json(product);
});

router.delete("/products/:id", async (req, res) => {
  await prisma.product.delete({ where: { id: String(req.params.id) } });
  return res.status(204).send();
});

router.get("/customers", async (_req, res) => {
  const customers = await prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
  return res.json(customers);
});

router.post("/customers", async (req, res) => {
  const parsed = customerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid customer payload.", issues: parsed.error.flatten() });
  }

  const customer = await prisma.customer.create({
    data: {
      ...parsed.data,
      email: parsed.data.email || null,
    },
  });
  return res.status(201).json(customer);
});

router.get("/suppliers", async (_req, res) => {
  const suppliers = await prisma.supplier.findMany({ orderBy: { createdAt: "desc" } });
  return res.json(suppliers);
});

router.post("/suppliers", async (req, res) => {
  const parsed = supplierSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid supplier payload.", issues: parsed.error.flatten() });
  }

  const supplier = await prisma.supplier.create({
    data: {
      ...parsed.data,
      email: parsed.data.email || null,
    },
  });
  return res.status(201).json(supplier);
});

export default router;
