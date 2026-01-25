import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { getUserById, searchUserByPhone } from "../services/userService";

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await getUserById(req.userId);
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const searchUser = async (req: AuthRequest, res: Response) => {
  try {
    const { phone } = req.query;

    if (!phone || typeof phone !== "string") {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const user = await searchUserByPhone(phone);
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
