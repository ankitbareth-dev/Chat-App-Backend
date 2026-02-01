import { Request, Response } from "express";
import { signupSchema, loginSchema } from "../validators/authValidator";
import { signupUser, loginUser } from "../services/authService";
import { ZodError } from "zod";

export const signup = async (req: Request, res: Response) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const user = await signupUser(validatedData);
    if (user) {
      res
        .status(201)
        .json({ success: true, message: "User created successfully" });
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      const missingFields = error.issues
        .filter(
          (issue) =>
            issue.code === "invalid_type" &&
            issue.message.includes("undefined"),
        )
        .map((issue) => issue.path.join("."));

      return res.status(400).json({
        message: "Missing required fields",
        missing: missingFields,
      });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { user, token } = await loginUser(validatedData);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    if (user) {
      res.status(200).json({ sucess: true, message: "Login successful" });
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      const missingFields = error.issues
        .filter(
          (issue) =>
            issue.code === "invalid_type" &&
            issue.message.includes("undefined"),
        )
        .map((issue) => issue.path.join("."));

      return res.status(400).json({
        message: "Missing required fields",
        missing: missingFields,
      });
    }
  }
};
