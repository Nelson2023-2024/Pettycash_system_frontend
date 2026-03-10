import z from "zod";

// ── Create ───────────────────────────────────────────────
export const createExpenseSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    expense_type: z.enum(["disbursement", "reimbursement"], {
      message: "Expense type must be disbursement or reimbursement",
    }),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    mpesa_phone: z
      .string()
      .regex(/^(?:254|\+254|0)?([71]\d{8})$/, "Enter a valid M-Pesa number"),
    receipt: z.instanceof(File).optional(),
  })
  .refine(
    (data) => {
      // receipt is required only for reimbursement
      if (data.expense_type === "reimbursement" && !data.receipt) return false;
      return true;
    },
    { message: "A receipt is required for reimbursement", path: ["receipt"] },
  );

// ── Update ───────────────────────────────────────────────
export const updateExpenseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  expense_type: z.enum(["disbursement", "reimbursement"]).optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .optional(),
  mpesa_phone: z
    .string()
    .regex(/^(?:254|\+254|0)?([71]\d{8})$/, "Enter a valid M-Pesa number")
    .optional(),
});

// ── Decide (FO/CFO) ──────────────────────────────────────
export const decideExpenseSchema = z
  .object({
    decision: z.enum(["approved", "rejected"], {
      message: "Decision must be approved or rejected",
    }),
    reason: z.string().min(5, "Please provide a reason").optional(),
  })
  .refine(
    (data) => {
      // reason is required when rejecting
      if (data.decision === "rejected" && !data.reason) return false;
      return true;
    },
    { message: "A reason is required when rejecting", path: ["reason"] },
  );

// ── Inferred Types ───────────────────────────────────────
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type DecideExpenseInput = z.infer<typeof decideExpenseSchema>;
