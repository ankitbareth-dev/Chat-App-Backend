import { Response } from "express";
import { searchUsersByPhone, updateProfile } from "../services/user.service";
import { sendSuccess } from "../utils/apiResponse";
import { catchAsync } from "../middleware/catchAsync";
import { AuthRequest } from "../middleware/authMiddleware";
import { AppError } from "../utils/AppError";
import { uploadToCloudinary } from "../services/upload.service";

export const updateUserProfile = catchAsync(
  async (req: AuthRequest, res: Response) => {
    if (!req.userId) {
      throw new AppError(401, "Unauthorized: No user ID found.");
    }

    const { name } = req.body;

    const updateData: { name?: string; profilePicture?: string } = {};

    if (name) {
      updateData.name = name;
    }

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file);

      if (uploadResult.success) {
        updateData.profilePicture = uploadResult.data.secure_url;
      } else {
        throw new AppError(500, "Failed to upload image");
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError(400, "No fields provided for update");
    }

    const updatedUser = await updateProfile(req.userId, updateData);

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
