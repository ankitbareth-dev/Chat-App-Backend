import { Request, Response, NextFunction } from "express";
import {
  signupUser,
  loginUser,
  checkUserStatus,
} from "../services/auth.service";
import { sendSuccess } from "../utils/apiResponse";
import { catchAsync } from "../middleware/catchAsync";
import { AppError } from "@/utils/AppError";
import { AuthRequest } from "@/middleware/authMiddleware";

export const signup = catchAsync(async (req: Request, res: Response) => {
  const user = await signupUser(req.body);

  sendSuccess(res, 201, "User created successfully", user);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await loginUser(req.body);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendSuccess(res, 200, "Login successful", { user });
});

export const logout = catchAsync(async (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  sendSuccess(res, 200, "Logout Successful");
});
export const checkAuth = catchAsync(async (req: AuthRequest, res: Response) => {
  const { userId } = req;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await checkUserStatus(userId);

  sendSuccess(res, 200, "User authenticated successfully", user);
});
