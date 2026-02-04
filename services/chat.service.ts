import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { ChatListUser, ChatMessage } from "../types/chat.types";
import { generateAvatarUrl } from "../utils/generateAvatar";

export const getChatHistory = async (
  myId: string,
  otherUserId: string,
  page: number,
  limit: number,
): Promise<ChatMessage[]> => {
  const skip = (page - 1) * limit;

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          AND: [{ senderId: myId }, { receiverId: otherUserId }],
        },
        {
          AND: [{ senderId: otherUserId }, { receiverId: myId }],
        },
      ],
    },
    orderBy: {
      timestamp: "desc",
    },
    take: limit,
    skip: skip,
    select: {
      id: true,
      content: true,
      senderId: true,
      receiverId: true,
      timestamp: true,
    },
  });

  return messages;
};
export const getChatList = async (myId: string): Promise<ChatListUser[]> => {
  try {
    const sentTo = await prisma.message.findMany({
      where: { senderId: myId },
      distinct: ["receiverId"],
      select: { receiverId: true },
    });

    const receivedFrom = await prisma.message.findMany({
      where: { receiverId: myId },
      distinct: ["senderId"],
      select: { senderId: true },
    });

    const sentIds = sentTo.map((item) => item.receiverId);
    const receivedIds = receivedFrom.map((item) => item.senderId);
    const uniqueUserIds = [...new Set([...sentIds, ...receivedIds])];

    if (uniqueUserIds.length === 0) {
      return [];
    }

    const users = await prisma.user.findMany({
      where: { id: { in: uniqueUserIds } },
      select: {
        id: true,
        name: true,
        phone: true,
        profilePicture: true,
      },
    });

    const formattedUsers = users.map((user) => ({
      ...user,
      profilePicture: user.profilePicture || generateAvatarUrl(user.name),
    }));

    return formattedUsers;
  } catch (error) {
    console.error("Get Chat List Error:", error);
    throw new AppError(500, "Failed to load chat list.");
  }
};
