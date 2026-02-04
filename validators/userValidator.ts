import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .optional(),

  profilePicture: z.url({ message: "Invalid URL format" }).optional(),
});
export const searchUserSchema = z.object({
  phone: z.string().min(3, "Please enter at least 3 digits to search"),
});
