"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/ui/status-badge";
import { Expense } from "@/types/expense";

export const expenseColumns: ColumnDef<Expense>[] = [
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

  // ── Title ──
  {
    accessorKey: "title",
    size: 300,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3"
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const title: string = row.getValue("title");
      return (
        <span className="text-sm font-medium">
          {title}
        </span>
      );
    },
  },

  // ── Amount ──
  {
    accessorKey: "amount",
    size: 130,
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },

  // ── Type ──
  {
    accessorKey: "expense_type",
    size: 150,
    header: "Type",
    cell: ({ row }) => {
      const type: string = row.getValue("expense_type");
      // Capitalise first letter e.g. "disbursement" → "Disbursement"
      return (
        <span className="text-sm">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      );
    },
  },

  // ── Status ──
  {
    accessorKey: "status",
    size: 150,
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },

  // ── Created At ──
  {
    accessorKey: "created_at",
    size: 130,
    header: "Created",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.getValue("created_at")).toLocaleDateString("en-KE", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  },
];
