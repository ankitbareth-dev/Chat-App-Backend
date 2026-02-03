import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { AppError } from "../utils/AppError";

export const validate = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");

        return next(new AppError(400, errorMessage));
      }

      next(error);
    }
  };
};
