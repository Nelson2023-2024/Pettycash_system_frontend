import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  pending:        "bg-[var(--status-pending)] text-[var(--status-pending-fg)] border-transparent",
  "under review": "bg-[var(--status-under-review)] text-[var(--status-under-review-fg)] border-transparent",
  active:         "bg-[var(--status-active)] text-[var(--status-active-fg)] border-transparent",
  approved:       "bg-[var(--status-approved)] text-[var(--status-approved-fg)] border-transparent",
  inactive:       "bg-[var(--status-inactive)] text-[var(--status-inactive-fg)] border-transparent",
  rejected:       "bg-[var(--status-rejected)] text-[var(--status-rejected-fg)] border-transparent",
  failed:         "bg-[var(--status-failed)] text-[var(--status-failed-fg)] border-transparent",
  disbursed:      "bg-[var(--status-disbursed)] text-[var(--status-disbursed-fg)] border-transparent",
  complete:       "bg-[var(--status-complete)] text-[var(--status-complete-fg)] border-transparent",
  processing:     "bg-[var(--status-processing)] text-[var(--status-processing-fg)] border-transparent",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const key = status.toLowerCase().trim();
  const className = statusStyles[key];

  return (
    <Badge variant="outline" className={className ?? "capitalize"}>
      {status}
    </Badge>
  );
}