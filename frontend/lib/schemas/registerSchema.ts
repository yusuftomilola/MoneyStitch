import z from "zod";

export const registerSchema = z.object({
  firstname: z
    .string("Input must be a string")
    .min(1, "Firstname is required")
    .max(30, "Too long")
    .transform((value) => value.trim().replace(/\s+/g, " "))
    .transform(
      (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    ),

  lastname: z
    .string("Input must be a string")
    .min(1, "Lastname is required")
    .max(30, "Too long")
    .transform((value) => value.trim().replace(/\s+/g, " "))
    .transform(
      (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    ),

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
    .refine(
      (password) =>
        !["password", "123456", "qwerty", "admin"].some((common) =>
          password.toLowerCase().includes(common)
        ),
      "Password should not contain common words"
    )
    .refine((val) => !/\s/.test(val), "Password cannot contain spaces"),
});
