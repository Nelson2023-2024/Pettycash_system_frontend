// lib/schemas/user.ts
import z from "zod";

export const createUserSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  other_name: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone_number: z.string().optional(),
  national_id: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  department: z.string().optional(),
});

export const updateProfileSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .optional(),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  other_name: z.string().optional(),
  phone_number: z.string().optional(),
  national_id: z.string().optional(),
  avatar_url: z.instanceof(File).optional(),
});

export const updateUserSchema = z.object({
  first_name: z.string().min(2, "First name is required").optional(),
  last_name: z.string().min(2, "Last name is required").optional(),
  other_name: z.string().optional(),
  email: z.email("Enter a valid email").optional(),
  phone_number: z.string().optional(),
  national_id: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  department: z.string().optional(),
  is_active: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
