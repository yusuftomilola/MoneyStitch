import z from "zod";

export const profileSchema = z.object({
  firstname: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name is too long")
    .transform((value) => value.trim().replace(/\s+/g, " "))
    .transform(
      (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    ),
  lastname: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name is too long")
    .transform((value) => value.trim().replace(/\s+/g, " "))
    .transform(
      (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    ),
  username: z.string().max(15, "Username is too long").optional(),
  email: z.email("Invalid email address").toLowerCase(),
  phone: z
    .string()
    .max(15, "Phone can't be greater than 15 characters")
    .optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});
