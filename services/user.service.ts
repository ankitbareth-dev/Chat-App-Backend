import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { PublicUser } from "../types/user.types";
import { generateAvatarUrl } from "../utils/generateAvatar";

export const updateProfile = async (
  userId: string,
  data: { name?: string; profilePicture?: string },
) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      profilePicture: data.profilePicture,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profilePicture: true,
      isOnline: true,
      lastSeen: true,
    },
  });
  return user;
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
        isOnline: true,
        lastSeen: true,
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
