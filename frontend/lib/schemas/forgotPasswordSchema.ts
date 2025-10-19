import z from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .max(50, "Email too long")
    .toLowerCase(),
});
