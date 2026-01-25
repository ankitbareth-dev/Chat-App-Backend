import { z } from "zod";

export const getMessagesSchema = z.object({
  userId: z.uuid(),
});
