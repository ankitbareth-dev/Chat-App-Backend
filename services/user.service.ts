import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { UpdateProfileInput, PublicUser } from "../types/user.types";
import { generateAvatarUrl } from "../utils/generateAvatar";

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
export const searchUsersByPhone = async (
  currentUserId: string,
  phonePrefix: string,
): Promise<PublicUser[]> => {
  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            phone: {
              startsWith: phonePrefix,
            },
          },
          {
            id: {
              not: currentUserId,
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        phone: true,
        profilePicture: true,
      },
      take: 10,
    });

    const formattedUsers = users.map((user: any) => ({
      ...user,
      profilePicture: user.profilePicture || generateAvatarUrl(user.name),
    }));

    return formattedUsers;
  } catch (error) {
    console.error("Search Error:", error);
    throw new AppError(500, "Failed to search users.");
  }
};
