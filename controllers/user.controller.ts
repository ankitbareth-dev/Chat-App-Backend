import { Response } from "express";
import { searchUsersByPhone, updateProfile } from "../services/user.service";
import { sendSuccess } from "../utils/apiResponse";
import { catchAsync } from "../middleware/catchAsync";
import { AuthRequest } from "../middleware/authMiddleware";

export const updateUserProfile = catchAsync(
  async (req: AuthRequest, res: Response) => {
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found." });
    }

    const updatedUser = await updateProfile(req.userId, req.body);

    sendSuccess(res, 200, "Profile updated successfully", updatedUser);
  },
);
export const searchUsers = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { userId } = req;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { phone } = req.query as any;

    const results = await searchUsersByPhone(userId, phone);

    sendSuccess(res, 200, "Users found", results);
  },
);
