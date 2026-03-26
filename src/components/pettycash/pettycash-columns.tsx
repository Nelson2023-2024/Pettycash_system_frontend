"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PettyCashActivity } from "@/types/pettycash";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const fmt = (val: string) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(parseFloat(val));

export const pettyCashActivityColumns: ColumnDef<PettyCashActivity>[] = [

  // ── Date ──
  {
    accessorKey: "date",
    size: 150,
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {date.toLocaleDateString("en-KE", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {date.toLocaleTimeString("en-KE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
    },
  },

  // ── Item ──
  {
    accessorKey: "item",
    size: 220,
    header: "Item",
    cell: ({ row }) => {
      const code: string = row.getValue("event_code");
      const isDeduction = code === "petty_cash_balance_deducted";
      return (
        <div className="flex items-center gap-2">
          {isDeduction ? (
            <ArrowDownCircle className="size-4 shrink-0 text-(--status-failed-fg)" />
          ) : (
            <ArrowUpCircle className="size-4 shrink-0 text-(--status-active-fg)" />
          )}
          <span className="text-sm font-medium">{row.getValue("item")}</span>
        </div>
      );
    },
  },

  // ── Triggered By ──
  {
    accessorKey: "triggered_by",
    size: 180,
    header: "Triggered By",
    cell: ({ row }) => {
      const person = row.getValue("triggered_by") as PettyCashActivity["triggered_by"];
      if (!person) return <span className="text-sm text-muted-foreground">—</span>;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{person.name}</span>
          <span className="text-xs text-muted-foreground">{person.email}</span>
        </div>
      );
    },
  },

  // ── Amount ──
  {
    accessorKey: "amount",
    size: 130,
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const code: string = row.getValue("event_code");
      const isDeduction = code === "petty_cash_balance_deducted";
      const val = row.getValue("amount") as string | null;
      if (!val) return <div className="text-right text-muted-foreground text-sm">—</div>;
      return (
        <div className={cn(
          "text-right tabular-nums text-sm font-medium",
          isDeduction ? "text-(--status-failed-fg)" : "ext-(--status-active-fg)",
        )}>
          {isDeduction ? "-" : "+"}{fmt(val)}
        </div>
      );
    },
  },

  // ── Transaction Cost ──
  {
    accessorKey: "transaction_cost",
    size: 140,
    header: () => <div className="text-right">Transaction Cost</div>,
    cell: ({ row }) => {
      const val = row.getValue("transaction_cost") as string | null;
      if (!val || val === "0") return <div className="text-right text-muted-foreground text-sm">—</div>;
      return (
        <div className="text-right tabular-nums text-sm text-muted-foreground">
          {fmt(val)}
        </div>
      );
    },
  },

  // ── Total Spent ──
  {
    accessorKey: "total_spent",
    size: 130,
    header: () => <div className="text-right">Total Spent</div>,
    cell: ({ row }) => {
      const val = row.getValue("total_spent") as string | null;
      if (!val) return <div className="text-right text-muted-foreground text-sm">—</div>;
      return (
        <div className="text-right tabular-nums text-sm font-medium">
          {fmt(val)}
        </div>
      );
    },
  },

  // ── Balance ──
  {
    accessorKey: "balance",
    size: 140,
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => {
      const val = row.getValue("balance") as string | null;
      if (!val) return <div className="text-right text-muted-foreground text-sm">—</div>;
      return (
        <div className="text-right tabular-nums text-sm font-medium">
          {fmt(val)}
        </div>
      );
    },
  },

  // ── hidden — used for event_code logic in item + amount cells ──
  {
    accessorKey: "event_code",
    size: 0,
    header: () => null,
    cell: () => null,
    enableHiding: true,
  },
];