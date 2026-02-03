import { Router } from "express";
import { signup, login, logout } from "../controllers/auth.controller";
import { validate } from "../middleware/validator";
import { signupSchema, loginSchema } from "../validators/authValidator";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

export default router;
