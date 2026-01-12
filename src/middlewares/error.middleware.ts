import { Request, Response, NextFunction } from "express";
import { ZodError, ZodIssue } from "zod";
import { ApiError } from "../errors/ApiError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.issues.map((issue: ZodIssue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
