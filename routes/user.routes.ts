import { Router } from "express";
import { searchUsers, updateUserProfile } from "../controllers/user.controller";
import { authenticate } from "../middleware/authMiddleware";
import { validate } from "../middleware/validator";
import {
  searchUserSchema,
  updateProfileSchema,
} from "../validators/userValidator";
import { upload } from "../config/multer";

const router = Router();

router.use(authenticate);

router.patch(
  "/update-profile",
  upload.single("profilePic"),
  validate(updateProfileSchema),
  updateUserProfile,
);

router.get("/search", validate(searchUserSchema, "query"), searchUsers);

export default router;
