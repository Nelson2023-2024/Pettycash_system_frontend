// lib/schemas/department.ts
import z from "zod";

// ── Create ───────────────────────────────────────────────
export const createDepartmentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  // code is typically a short uppercase identifier e.g. "FIN", "HR"
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(10, "Code must be at most 10 characters")
    .toUpperCase(),
    line_manager_id: z.string().uuid("Invalid line manager ID").optional(),
});

// ── Update ───────────────────────────────────────────────
// name is required on update — matches backend required_fields
export const updateDepartmentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(10, "Code must be at most 10 characters")
    .toUpperCase()
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  // UUID of the line manager user
  line_manager_id: z.string().uuid("Invalid line manager ID").optional(),
});

// ── Inferred Types ───────────────────────────────────────
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;