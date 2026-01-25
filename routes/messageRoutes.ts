import { Router } from "express";
import { getMessagesController } from "../controllers/messageController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/:userId", authenticate, getMessagesController);

export default router;
