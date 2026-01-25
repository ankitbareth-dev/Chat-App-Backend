import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { getMessagesSchema } from "../validators/messageValidator";
import { getConversation } from "../services/messageService";

export const getMessagesController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId } = req.params;

    const validatedData = getMessagesSchema.parse({ userId });
    const messages = await getConversation(req.userId, validatedData.userId);

    res.status(200).json({ messages });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};
