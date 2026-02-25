import { Response } from "express";
import { uploadVoiceNote } from "../services/upload.service";
import { sendSuccess } from "../utils/apiResponse";
import { catchAsync } from "../middleware/catchAsync";
import { AuthRequest } from "../middleware/authMiddleware";

export const uploadVoiceController = catchAsync(
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "No voice file uploaded" });
    }

    const { url, duration } = await uploadVoiceNote(req.file);

    sendSuccess(res, 200, "Voice note uploaded successfully", {
      url,
      duration,
    });
  },
);
