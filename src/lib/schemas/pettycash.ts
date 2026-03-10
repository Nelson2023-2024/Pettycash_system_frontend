// lib/schemas/pettycash.ts
import z from "zod";

// Reusable M-Pesa phone regex — same rule used across all schemas
const mpesaPhone = z
  .string()
  .regex(/^(?:254|\+254|0)?([71]\d{8})$/, "Enter a valid M-Pesa number");

// ── Create ───────────────────────────────────────────────
export const createPettyCashSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  mpesa_phone_number: mpesaPhone,
  // coerce converts string input from form fields to number before validating
  minimum_threshold: z.coerce
    .number()
    .positive("Minimum threshold must be greater than 0"),
});

// ── Update ───────────────────────────────────────────────
// All fields optional — only send what changed
export const updatePettyCashSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  mpesa_phone_number: mpesaPhone.optional(),
  minimum_threshold: z.coerce
    .number()
    .positive("Minimum threshold must be greater than 0")
    .optional(),
  account_type: z.string().optional(),
});

// ── Inferred Types ───────────────────────────────────────
export type CreatePettyCashInput = z.infer<typeof createPettyCashSchema>;
export type UpdatePettyCashInput = z.infer<typeof updatePettyCashSchema>;