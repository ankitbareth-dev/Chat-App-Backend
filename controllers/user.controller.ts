import { Response, NextFunction } from "express";
import { updateProfile } from "../services/user.service";
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
