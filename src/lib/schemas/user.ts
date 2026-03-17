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

export type CreateUserInput = z.infer<typeof createUserSchema>;