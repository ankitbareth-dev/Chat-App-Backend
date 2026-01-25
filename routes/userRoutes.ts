import { Router } from "express";
import { getMe, searchUser } from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", authenticate, getMe);
router.get("/search", authenticate, searchUser);

export default router;
