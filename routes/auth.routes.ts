import { Router } from "express";
import {
  signup,
  login,
  logout,
  checkAuth,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validator";
import { signupSchema, loginSchema } from "../validators/authValidator";
import { authenticate } from "@/middleware/authMiddleware";

const router = Router();

router.get("/check-auth", authenticate, checkAuth);
router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

export default router;
