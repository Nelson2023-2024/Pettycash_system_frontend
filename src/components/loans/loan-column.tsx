// columns/loan.columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Loan } from "@/types/loan";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StatusBadge } from "../ui/status-badge";
import { Checkbox } from "../ui/checkbox";

const fmt = (val: string) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(parseFloat(val));

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  approved: "default",
  disbursed: "default",
  repaid: "default",
  rejected: "destructive",
};

export const loanColumns: ColumnDef<Loan>[] = [
    // checkbox
  {
    id: "select",
    size: 40,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // ── Employee ──────────────────────────────────────────
  {
    accessorKey: "employee",
    header: "Employee",
    size: 200,
    cell: ({ row }) => {
      const employee = row.getValue("employee") as Loan["employee"];
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{employee.name}</span>
          <span className="text-xs text-muted-foreground">
            {employee.email}
          </span>
        </div>
      );
    },
  },

  // // ── Reason ────────────────────────────────────────────
  // {
  //   accessorKey: "reason",
  //   header: "Reason",
  //   size: 220,
  //   cell: ({ row }) => (
  //     <span className="text-sm truncate max-w-50 block">
  //       {row.getValue("reason")}
  //     </span>
  //   ),
  // },

  // ── Amount ────────────────────────────────────────────
  {
    accessorKey: "amount",
    size: 130,
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums text-sm font-medium">
        {fmt(row.getValue("amount"))}
      </div>
    ),
  },

  // ── Transaction Cost ──────────────────────────────────
  {
    accessorKey: "transaction_cost",
    size: 150,
    header: () => <div className="text-right">Transaction Cost</div>,
    cell: ({ row }) => {
      const val = row.getValue("transaction_cost") as string | null;
      if (!val)
        return (
          <div className="text-right text-sm text-muted-foreground">—</div>
        );
      return (
        <div className="text-right tabular-nums text-sm text-muted-foreground">
          {fmt(val)}
        </div>
      );
    },
  },

  // ── Total Deduction ───────────────────────────────────
  {
    accessorKey: "total_deduction",
    size: 150,
    header: () => <div className="text-right">Total Deduction</div>,
    cell: ({ row }) => {
      const val = row.getValue("total_deduction") as string | null;
      if (!val)
        return (
          <div className="text-right text-sm text-muted-foreground">—</div>
        );
      return (
        <div className="text-right tabular-nums text-sm font-medium text-destructive">
          -{fmt(val)}
        </div>
      );
    },
  },

  // ── Status ────────────────────────────────────────────
  {
    accessorKey: "status_code",
    header: "Status",
    size: 120,
    cell: ({ row }) => {
      const label: string = row.original.status;
      return <StatusBadge status={label} />;
    },
  },

  // ── Decision By ───────────────────────────────────────
  {
    accessorKey: "decision_by",
    header: "Decided By",
    size: 180,
    cell: ({ row }) => {
      const person = row.getValue("decision_by") as Loan["decision_by"];
      if (!person)
        return <span className="text-sm text-muted-foreground">—</span>;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{person.name}</span>
          <span className="text-xs text-muted-foreground">{person.email}</span>
        </div>
      );
    },
  },

  // ── Due Date ──────────────────────────────────────────
  {
    accessorKey: "due_date",
    header: "Due Date",
    size: 130,
    cell: ({ row }) => {
      const val = row.getValue("due_date") as string | null;
      if (!val) return <span className="text-sm text-muted-foreground">—</span>;
      const date = new Date(val);
      const isOverdue =
        date < new Date() && row.original.status_code !== "repaid";
      return (
        <span
          className={cn("text-sm font-medium", isOverdue && "text-destructive")}
        >
          {date.toLocaleDateString("en-KE", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      );
    },
  },

  // ── Created ───────────────────────────────────────────
  {
    accessorKey: "created_at",
    header: "Created",
    size: 150,
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {date.toLocaleDateString("en-KE", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="text-xs text-muted-foreground">
            {date.toLocaleTimeString("en-KE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
    },
  },
];
