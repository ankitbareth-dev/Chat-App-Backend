import cloudinary from "../config/cloudinary";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

type UploadResponse =
  | { success: true; data: UploadApiResponse }
  | { success: false; error: UploadApiErrorResponse };

const uploadToCloudinary = (
  file: Express.Multer.File,
  folderName: string,
  resourceType: "image" | "video" | "raw" = "image",
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) return reject({ success: false, error });
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
export const uploadMediaFile = async (file: Express.Multer.File) => {
  const mimeType = file.mimetype;
  let folder = "chat_app_media";
  let resourceType: "image" | "video" | "raw" = "image";
  let finalUrl = "";
  let thumbnailUrl = "";

  if (mimeType.startsWith("image")) {
    const result = await uploadToCloudinary(file, folder, "image");
    if (!result.success) throw new Error("Image upload failed");

    finalUrl = result.data.secure_url;

    thumbnailUrl = result.data.secure_url.replace(
      "/upload/",
      "/upload/c_scale,w_50,q_20/",
    );

    return {
      url: finalUrl,
      thumbnailUrl,
      mimeType,
      fileName: file.originalname,
      fileSize: file.size,
      resourceType: "image",
    };
  }

  if (mimeType.startsWith("video")) {
    const result = await uploadToCloudinary(file, folder, "video");
    if (!result.success) throw new Error("Video upload failed");

    finalUrl = result.data.secure_url;

    thumbnailUrl = result.data.secure_url
      .replace(/\.\w+$/, ".jpg")
      .replace("/upload/", "/upload/c_scale,w_100,q_30/");

    return {
      url: finalUrl,
      thumbnailUrl,
      mimeType,
      fileName: file.originalname,
      fileSize: file.size,
      duration: result.data.duration,
      resourceType: "video",
    };
  }

  if (mimeType === "application/pdf") {
    const result = await uploadToCloudinary(file, folder, "raw");
    if (!result.success) throw new Error("PDF upload failed");

    return {
      url: result.data.secure_url,
      thumbnailUrl: null,
      mimeType,
      fileName: file.originalname,
      fileSize: file.size,
      resourceType: "raw",
    };
  }

  throw new Error("Unsupported file type");
};
