import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json({ message: "Route not found." });
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Keep error responses consistent across module endpoints.
  return res.status(500).json({
    message: "Unexpected server error.",
    error: error.message,
  });
}
