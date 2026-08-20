import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import moduleRoutes from "./routes/modules.js";
import catalogRoutes from "./routes/catalog.js";
import { authMiddleware } from "./middleware/auth.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL ?? "http://localhost:3000",
      "https://my-erp-web.onrender.com",
      "http://localhost:3000",
    ],
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/modules", authMiddleware, moduleRoutes);
app.use("/api/catalog", authMiddleware, catalogRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
