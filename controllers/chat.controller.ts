import { Response } from "express";
import {
  getChatHistory,
  getChatList,
  saveMessage,
} from "../services/chat.service";
import { sendSuccess } from "../utils/apiResponse";
import { catchAsync } from "../middleware/catchAsync";
import { AuthRequest } from "../middleware/authMiddleware";

export const getMessages = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { userId } = req;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { receiverId, page, limit } = req.query as any;

    const messages = await getChatHistory(userId, receiverId, page, limit);

    sendSuccess(res, 200, "Messages fetched successfully", {
      messages,
      currentPage: page,
      itemsPerPage: limit,
      count: messages.length,
    });
  },
);
export const getChatsList = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { userId } = req;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = await getChatList(userId);

    sendSuccess(res, 200, "Chat list retrieved successfully", users);
  },
);
export const sendMessageFallback = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { userId } = req;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { receiverId, content } = req.body;

    const message = await saveMessage({
      senderId: userId,
      receiverId,
      content,
    });

    sendSuccess(res, 201, "Message sent successfully", message);
  },
);
