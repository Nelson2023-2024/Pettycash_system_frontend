import z from "zod";

// ── Create ───────────────────────────────────────────────
export const createLoanSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0"),
  reason: z
    .string()
    .min(10, "Please provide a reason of at least 10 characters"),
});

// ── Decide (FO) ──────────────────────────────────────────
// decision_reason is optional on approval but required on rejection
export const decideLoanSchema = z
  .object({
    decision: z.enum(["approved", "rejected"], {
      message: "Decision must be approved or rejected",
    }),
    decision_reason: z
      .string()
      .min(5, "Please provide a reason")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.decision === "rejected" && !data.decision_reason) return false;
      return true;
    },
    {
      message: "A reason is required when rejecting",
      path: ["decision_reason"],
    }
  );

// ── Inferred Types ───────────────────────────────────────
export type CreateLoanInput = z.infer<typeof createLoanSchema>;
export type DecideLoanInput = z.infer<typeof decideLoanSchema>;