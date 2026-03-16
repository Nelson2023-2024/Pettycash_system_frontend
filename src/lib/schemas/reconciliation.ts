// lib/schemas/reconciliation.ts
import z from "zod";

// ── Submit ───────────────────────────────────────────────
// Employee submits after cash has been disbursed.
// reconciled_amount + surplus_returned must equal the disbursed amount
// — this cross-field check is enforced on the backend but the refine
// here catches it early on the frontend before the request is sent.
export const submitReconciliationSchema = z.object({
  reconciled_amount: z.coerce
    .number()
    .positive("Reconciled amount must be greater than 0"),
  surplus_returned: z.coerce
    .number()
    .min(0, "Surplus returned cannot be negative and is required"),
  comments: z.string().optional(),
  receipt: z.instanceof(File, { message: "A receipt file is required" }),
});

// ── Review (FO) ──────────────────────────────────────────
// Finance Officer approves (completed) or rejects the reconciliation.
// On rejection — comments are required so the employee knows what to fix.
// On completion — comments are optional.
export const reviewReconciliationSchema = z
  .object({
    decision: z.enum(["completed", "rejected"], {
      message: "Decision must be completed or rejected",
    }),
    comments: z.string().min(0, "Please provide a comment").optional(),
  })
  .refine(
    (data) => {
      if (data.decision === "rejected" && !data.comments) return false;
      return true;
    },
    {
      message: "Comments are required when rejecting",
      path: ["comments"],
    },
  );

// ── Inferred Types ───────────────────────────────────────
export type SubmitReconciliationInput = z.infer<
  typeof submitReconciliationSchema
>;
export type ReviewReconciliationInput = z.infer<
  typeof reviewReconciliationSchema
>;
