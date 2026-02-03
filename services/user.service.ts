import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { UpdateProfileInput } from "../types/user.types";

export const updateProfile = async (
  userId: string,
  data: UpdateProfileInput,
) => {
  const updateData: any = {};

  if (data.name) {
    updateData.name = data.name;
  }

  if (data.profilePicture) {
    updateData.profilePicture = data.profilePicture;
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError(400, "No data provided for update.");
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profilePicture: true,
        createdAt: true,
      },
    });

    return updatedUser;
  } catch (error: any) {
    if (error.code === "P2025") {
      throw new AppError(404, "User not found.");
    }
    console.error("Profile Update Error:", error);
    throw new AppError(500, "Failed to update profile.");
  }
};
