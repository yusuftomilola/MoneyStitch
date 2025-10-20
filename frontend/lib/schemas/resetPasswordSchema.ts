import z from "zod";

export const resetPasswordSchema = z.object({
  password: z
    .string("Password must be a string")
    .min(8, "Password must be atleast 8 characters")
    .max(80, "Password is too long")
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
  newPassword: z
    .string("Password must be a string")
    .min(8, "Password must be atleast 8 characters")
    .max(80, "Password is too long")
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
