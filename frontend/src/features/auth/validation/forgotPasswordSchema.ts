import { z } from "zod";

export const forgotPasswordSchema =
  z.object({
    userId: z
      .string()
      .min(1, "Email ID is required"),

    mobileNumber: z
      .string()
      .min(
        10,
        "Mobile Number is required"
      ),
  });