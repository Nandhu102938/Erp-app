import { Router } from "express";
import { z } from "zod";
import { isValidModule } from "../config/modules.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

const moduleEntrySchema = z.object({
  operation: z.string().min(2).optional().default("general"),
  title: z.string().min(2),
  description: z.string().optional().default(""),
  amount: z.coerce.number().min(0).optional().default(0),
  quantity: z.coerce.number().min(0).optional().default(0),
  reference: z.string().optional().default(""),
  partyName: z.string().optional().default(""),
  status: z.string().optional().default("draft"),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

router.get("/:module", async (req, res) => {
  const moduleName = String(req.params.module);
  if (!isValidModule(moduleName)) {
    return res.status(400).json({ message: "Invalid module name." });
  }

  const operation = typeof req.query.operation === "string" ? req.query.operation : undefined;

  const entries = await prisma.moduleEntry.findMany({
    where: {
      module: moduleName,
      ...(operation ? { operation } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(entries);
});

router.post("/:module", async (req: AuthenticatedRequest, res) => {
  const moduleName = String(req.params.module);
  if (!isValidModule(moduleName)) {
    return res.status(400).json({ message: "Invalid module name." });
  }

  const parsed = moduleEntrySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid form payload.",
      issues: parsed.error.flatten(),
    });
  }

  const entry = await prisma.moduleEntry.create({
    data: {
      module: moduleName,
      ...parsed.data,
      createdById: req.user?.userId,
    },
  });

  return res.status(201).json(entry);
});

router.put("/:module/:id", async (req, res) => {
  const moduleName = String(req.params.module);
  if (!isValidModule(moduleName)) {
    return res.status(400).json({ message: "Invalid module name." });
  }

  const parsed = moduleEntrySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid form payload.",
      issues: parsed.error.flatten(),
    });
  }

  const updated = await prisma.moduleEntry.update({
    where: { id: String(req.params.id) },
    data: parsed.data,
  });

  return res.json(updated);
});

router.delete("/:module/:id", async (req, res) => {
  const moduleName = String(req.params.module);
  if (!isValidModule(moduleName)) {
    return res.status(400).json({ message: "Invalid module name." });
  }

  await prisma.moduleEntry.delete({ where: { id: String(req.params.id) } });
  return res.status(204).send();
});

export default router;
