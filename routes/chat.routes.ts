import { Router } from "express";
import { getMessages } from "../controllers/chat.controller";
import { authenticate } from "../middleware/authMiddleware";
import { validate } from "../middleware/validator";
import { getMessagesSchema } from "../validators/chatValidator";

const router = Router();

router.use(authenticate);

router.get("/history", validate(getMessagesSchema), getMessages);

export default router;
