import { Router } from "express";
import { z } from "zod";
import {
  getChatsList,
  getMessages,
  sendMessageFallback,
} from "../controllers/chat.controller";
import { authenticate } from "../middleware/authMiddleware";
import { validate } from "../middleware/validator";
import { getMessagesSchema } from "../validators/chatValidator";

const router = Router();
const sendMessageSchema = z.object({
  receiverId: z.string(),
  content: z.string().min(1),
});

router.use(authenticate);

router.get("/history", validate(getMessagesSchema, "query"), getMessages);
router.get("/list", getChatsList);

router.post("/send", validate(sendMessageSchema), sendMessageFallback);

export default router;
