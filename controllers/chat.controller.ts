import { Response } from "express";
import { getChatHistory } from "../services/chat.service";
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
