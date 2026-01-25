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
