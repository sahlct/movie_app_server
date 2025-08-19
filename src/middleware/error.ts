import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, "Not Found"));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      details: err.details ?? undefined
    });
  }
  console.error(err);
  res.status(500).json({ status: 500, message: "Internal Server Error" });
}
