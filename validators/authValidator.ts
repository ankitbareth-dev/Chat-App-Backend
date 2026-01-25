import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  phone: z.string().min(10),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  phone: z.string().min(10),
  password: z.string().min(6),
});
