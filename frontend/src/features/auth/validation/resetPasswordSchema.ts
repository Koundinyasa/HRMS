import { z } from "zod";

export const resetPasswordSchema =
  z
    .object({
      password: z
        .string()
        .min(
          8,
          "Password must be at least 8 characters"
        )
        // Same rule the server enforces.
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
          "Password must contain uppercase, lowercase, number and special character (@ $ ! % * ? &)"
        ),

      confirmPassword:
        z.string(),
    })
    .refine(
      (data) =>
        data.password ===
        data.confirmPassword,
      {
        message:
          "Passwords do not match",
        path: [
          "confirmPassword",
        ],
      }
    );