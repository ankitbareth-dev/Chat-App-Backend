import { Router } from "express";
import { z } from "zod";
import {
  getChatsList,
  getMessages,
  sendMessageFallback,
} from "../controllers/chat.controller";
import { authenticate } from "../middleware/authMiddleware";
import { validate } from "../middleware/validator";
import {
  getMessagesSchema,
  sendMessageSchema,
} from "../validators/chatValidator";

const router = Router();

router.use(authenticate);

router.get("/history", validate(getMessagesSchema, "query"), getMessages);
router.post("/send", validate(sendMessageSchema), sendMessageFallback);
router.get("/list", getChatsList);

export default router;
