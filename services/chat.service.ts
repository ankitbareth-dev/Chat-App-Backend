import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { ChatMessage } from "../types/chat.types";

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
