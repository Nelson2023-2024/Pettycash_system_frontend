export const fmt = (val: string | number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(Number(val));

export const fmtCompact = (val: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    notation: "compact",
  }).format(val);

export const eventColorMap: Record<string, string> = {
  expense_approved: "var(--status-approved-fg)",
  expense_rejected: "var(--status-rejected-fg)",
  expense_disbursed: "var(--status-disbursed-fg)",
  expense_submitted: "var(--status-pending-fg)",
  expense_completed: "var(--status-complete-fg)",
  expense_updated: "var(--status-processing-fg)",
  expense_reconciliation_submitted: "var(--status-under-review-fg)",
  topup_requested: "var(--status-pending-fg)",
  topup_approved: "var(--status-approved-fg)",
  topup_disbursed: "var(--status-disbursed-fg)",
  topup_rejected: "var(--status-rejected-fg)",
};