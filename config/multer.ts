import multer from "multer";
import { AppError } from "../utils/AppError";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Only image files are allowed!"));
  }
};

const limits = {
  fileSize: 2 * 1024 * 1024,
};

export const upload = multer({
  storage,
  fileFilter,
  limits,
});
