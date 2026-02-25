import cloudinary from "../config/cloudinary";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

type UploadResponse =
  | { success: true; data: UploadApiResponse }
  | { success: false; error: UploadApiErrorResponse };

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folderName: string = "chat-app-profiles",
  resourceType: "image" | "video" | "auto" = "image",
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          return reject({ success: false, error });
        }
        resolve({ success: true, data: result });
      },
    );

    uploadStream.end(file.buffer);
  });
};

export const uploadVoiceNote = async (file: Express.Multer.File) => {
  const result = await uploadToCloudinary(file, "chat_app_voices", "video");

  if (!result.success) {
    throw new Error("Failed to upload voice note");
  }

  return {
    url: result.data.secure_url,
    duration: Math.round(result.data.duration || 0),
  };
};
