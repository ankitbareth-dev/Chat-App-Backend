import { prisma } from "../utils/prisma";

export const sendMessage = async (
  senderId: string,
  receiverId: string,
  content: string,
) => {
  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId,
      content,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return message;
};

export const getConversation = async (userId: string, partnerId: string) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          AND: [{ senderId: userId }, { receiverId: partnerId }],
        },
        {
          AND: [{ senderId: partnerId }, { receiverId: userId }],
        },
      ],
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  return messages;
};
