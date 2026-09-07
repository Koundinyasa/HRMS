import { z } from "zod";

export const forgotPasswordSchema = z.object({
  userId: z
    .string()
    .min(1, "Email ID is required")
    .email("Enter a valid Email ID"),
});
