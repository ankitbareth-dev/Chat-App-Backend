import { z } from "zod";

export const getMessagesSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});
