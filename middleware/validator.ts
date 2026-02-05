import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { AppError } from "../utils/AppError";

export const validate = (
  schema: ZodType<unknown>,
  target: "body" | "query" | "params" = "body",
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const dataToValidate =
        target === "body"
          ? req.body
          : target === "query"
            ? req.query
            : req.params;

      const validatedData = schema.parse(dataToValidate);
      if (target === "body") {
        req.body = validatedData as any;
      } else {
        req.query = validatedData as any;
      }
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
