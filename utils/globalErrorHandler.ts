import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";
import { ZodError } from "zod";
import { sendError } from "./apiResponse";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message);
  }

  if (err instanceof ZodError) {
    const errorMessages = err.issues.map((e) => e.message).join(". ");

    return sendError(res, 400, `Validation Error: ${errorMessages}`);
  }

  if (err.name === "JsonWebTokenError") {
    return sendError(res, 401, "Invalid token. Please log in again.");
  }

  if (err.name === "TokenExpiredError") {
    return sendError(res, 401, "Your token has expired. Please log in again.");
  }

  console.error("ERROR 💥:", err);
  return sendError(
    res,
    500,
    "Something went very wrong on the server.",
    err.message,
  );
};
