import z from "zod";

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .max(50, "Too long")
    .toLowerCase(),

  password: z
    .string("Password must be a string")
    .min(8, "Password must be atleast 8 characters")
    .max(80, "Too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_.]).+$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    )
    .refine((val) => !/\s/.test(val), "Password cannot contain spaces"),
});
