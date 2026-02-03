import { Router } from "express";
import { updateUserProfile } from "../controllers/user.controller";
import { authenticate } from "../middleware/authMiddleware";
import { validate } from "../middleware/validator";
import { updateProfileSchema } from "../validators/userValidator";

const router = Router();

router.use(authenticate);

router.patch(
  "/update-profile",
  validate(updateProfileSchema),
  updateUserProfile,
);

export default router;
