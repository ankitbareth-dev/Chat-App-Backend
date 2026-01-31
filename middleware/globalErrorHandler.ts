import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err?.statusCode || 500;

  res.status(statusCode).json({
    message: err?.message || "Something went wrong",
  });
};
