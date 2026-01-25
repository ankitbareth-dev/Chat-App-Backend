import { Request, Response } from "express";
import { signupSchema, loginSchema } from "../validators/authValidator";
import { signupUser, loginUser } from "../services/authService";

export const signup = async (req: Request, res: Response) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const user = await signupUser(validatedData);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: error.errors });
    }
    res.status(500).json({ message: error.message });
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

    res.status(200).json({ message: "Login successful", user });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: error.errors });
    }
    res.status(401).json({ message: error.message });
  }
};
