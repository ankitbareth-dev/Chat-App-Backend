import multer from "multer";
import { AppError } from "../utils/AppError";

const storage = multer.memoryStorage();

const imageFileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Only image files are allowed!"));
  }
};

const audioFileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype.startsWith("audio")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Only audio files are allowed!"));
  }
};

export const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export const uploadVoice = multer({
  storage,
  fileFilter: audioFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
