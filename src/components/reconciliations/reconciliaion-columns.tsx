"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/ui/status-badge";
import { TopUp } from "@/types/topup";
import { ColumnDef } from "@tanstack/react-table";
import { Reconciliation } from "@/types/reconciliation";

export const reconciliationColumns: ColumnDef<Reconciliation>[] = [
  // ── Checkbox ──
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

  {
    accessorKey: "expense_request_title",
    header: "Expense Title",
  },

  // ── Disbursed Amount ──
  {
    accessorKey: "disbursed_amount",
    size: 130,
    header: () => <div className="text-right">Disbursed Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("disbursed_amount"));
      const formatted = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },

  // ── Reconsilded Amount ──
  {
    accessorKey: "reconciled_amount",
    size: 130,
    header: () => <div>Reconciled Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("disbursed_amount"));
      const formatted = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },

  // ── Submitted By ──
  {
    accessorKey: "submitted_by",
    size: 180,
    header: "Submitted By",
    cell: ({ row }) => {
      const decider = row.getValue(
        "submitted_by",
      ) as Reconciliation["submitted_by"];
      if (!decider)
        return <span className="text-sm text-muted-foreground">—</span>;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{decider.name}</span>
          <span className="text-xs text-muted-foreground">{decider.email}</span>
        </div>
      );
    },
  },
  // ── Decision By ──
  {
    accessorKey: "approved_by",
    size: 180,
    header: "Approved By",
    cell: ({ row }) => {
      const decider = row.getValue(
        "approved_by",
      ) as Reconciliation["approved_by"];
      if (!decider)
        return <span className="text-sm text-muted-foreground">—</span>;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{decider.name}</span>
          <span className="text-xs text-muted-foreground">{decider.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },

  //created at
  {
    accessorKey: "created_at",
    size: 150,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3"
      >
        Created at
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
