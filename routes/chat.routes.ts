import { Router } from "express";
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
import {
  uploadMediaController,
  uploadVoiceController,
} from "../controllers/upload.controller";
import { uploadMedia, uploadVoice } from "../config/multer";

const router = Router();

router.use(authenticate);

router.get("/history", validate(getMessagesSchema, "query"), getMessages);
router.post("/send", validate(sendMessageSchema), sendMessageFallback);
router.get("/list", getChatsList);

router.post(
  "/upload-voice",
  uploadVoice.single("voice"),
  uploadVoiceController,
);

router.post(
  "/upload-media",
  uploadMedia.single("media"),
  uploadMediaController,
);

export default router;
