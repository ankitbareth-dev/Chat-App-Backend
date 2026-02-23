import cloudinary from "../config/cloudinary";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

type UploadResponse =
  | { success: true; data: UploadApiResponse }
  | { success: false; error: UploadApiErrorResponse };

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folderName: string = "chat-app-profiles",
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: "image",
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
