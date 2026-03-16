// lib/schemas/topup.ts
import z from "zod";

// ── Create ───────────────────────────────────────────────
export const createTopUpSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .max(20000, "Top-up amount exceeds allowed limit of  KES 50,000"),
  request_reason: z
    .string()
    .min(10, "Please provide a reason of at least 10 characters"),
});

// ── Update ───────────────────────────────────────────────
// Only pending top-ups can be updated — enforced on the backend
export const updateTopUpSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .optional(),
  request_reason: z
    .string()
    .min(10, "Please provide a reason of at least 10 characters")
    .optional(),
});

// ── Decide (CFO/FO) ──────────────────────────────────────
// decision_reason is optional on approval but required on rejection
export const decideTopUpSchema = z
  .object({
    decision: z.enum(["approved", "rejected"], {
      message: "Decision must be approved or rejected",
    }),
    decision_reason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.decision === "rejected" && !data.decision_reason) return false;
      return true;
    },
    {
      message: "A reason is required when rejecting",
      path: ["decision_reason"],
    },
  );

// ── Inferred Types ───────────────────────────────────────
export type CreateTopUpInput = z.infer<typeof createTopUpSchema>;
export type UpdateTopUpInput = z.infer<typeof updateTopUpSchema>;
export type DecideTopUpInput = z.infer<typeof decideTopUpSchema>;
