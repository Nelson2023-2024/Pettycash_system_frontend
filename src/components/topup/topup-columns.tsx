"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/ui/status-badge";
import { TopUp } from "@/types/topup";
import { ColumnDef } from "@tanstack/react-table";

export const topupColumns: ColumnDef<TopUp>[] = [
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

  // ── Account Name ──
  {
    accessorKey: "pettycash_account",
    size: 200,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3"
      >
        Account Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const account = row.getValue(
        "pettycash_account",
      ) as TopUp["pettycash_account"];
      return (
        <span className="text-sm font-medium">{account?.name ?? "—"}</span>
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
        minimumFractionDigits: 0,
      }).format(amount);
      return (
        <div className="text-right font-medium tabular-nums">{formatted}</div>
      );
    },
  },

  // ── Request Reason ──
  {
    accessorKey: "request_reason",
    size: 200,
    header: "Reason",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground line-clamp-1">
        {row.getValue("request_reason")}
      </span>
    ),
  },

  // ── Requested By ──
  {
    accessorKey: "requested_by",
    size: 180,
    header: "Requested By",
    cell: ({ row }) => {
      const requester = row.getValue("requested_by") as TopUp["requested_by"];
      if (!requester)
        return <span className="text-sm text-muted-foreground">—</span>;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{requester.name}</span>
          <span className="text-xs text-muted-foreground">
            {requester.email}
          </span>
        </div>
      );
    },
  },

  // ── Status ──
  {
    accessorKey: "status",
    size: 130,
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string | null;
      if (!status)
        return <span className="text-sm text-muted-foreground">—</span>;
      return <StatusBadge status={status} />;
    },
  },

  // ── Decision By ──
  {
    accessorKey: "decision_by",
    size: 180,
    header: "Decided By",
    cell: ({ row }) => {
      const decider = row.getValue("decision_by") as TopUp["decision_by"];
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
  // ── Previous Balance ──
  // {
  //   accessorKey: "previous_balance",
  //   size: 140,
  //   header: () => <div className="text-right">Balance Before</div>,
  //   cell: ({ row }) => {
  //     const val = row.getValue("previous_balance") as string | null;
  //     if (!val)
  //       return (
  //         <div className="text-right text-muted-foreground text-sm">—</div>
  //       );
  //     return (
  //       <div className="text-right tabular-nums text-sm">
  //         {new Intl.NumberFormat("en-KE", {
  //           style: "currency",
  //           currency: "KES",
  //           minimumFractionDigits: 0,
  //         }).format(parseFloat(val))}
  //       </div>
  //     );
  //   },
  // },

  // // ── New Balance ──
  // {
  //   accessorKey: "new_balance",
  //   size: 140,
  //   header: () => <div className="text-right">Balance After</div>,
  //   cell: ({ row }) => {
  //     const val = row.getValue("new_balance") as string | null;
  //     if (!val)
  //       return (
  //         <div className="text-right text-muted-foreground text-sm">—</div>
  //       );
  //     return (
  //       <div className="text-right tabular-nums text-sm font-medium">
  //         {new Intl.NumberFormat("en-KE", {
  //           style: "currency",
  //           currency: "KES",
  //           minimumFractionDigits: 0,
  //         }).format(parseFloat(val))}
  //       </div>
  //     );
  //   },
  // },

  // // ── Disbursed At ──
  // {
  //   accessorKey: "disbursed_at",
  //   size: 150,
  //   header: "Disbursed At",
  //   cell: ({ row }) => {
  //     const val = row.getValue("disbursed_at") as string | null;
  //     if (!val) return <span className="text-sm text-muted-foreground">—</span>;
  //     const date = new Date(val);
  //     return (
  //       <div className="flex flex-col">
  //         <span className="text-sm">
  //           {date.toLocaleDateString("en-KE", {
  //             day: "numeric",
  //             month: "short",
  //             year: "numeric",
  //           })}
  //         </span>
  //         <span className="text-xs text-muted-foreground">
  //           {date.toLocaleTimeString("en-KE", {
  //             hour: "2-digit",
  //             minute: "2-digit",
  //           })}
  //         </span>
  //       </div>
  //     );
  //   },
  // },

  // ── Auto Triggered ──
  {
    accessorKey: "is_auto_triggered",
    size: 120,
    header: "Auto Triggered",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.getValue("is_auto_triggered") ? "Yes" : "No"}
      </span>
    ),
  },

  //created at
  {
    accessorKey: "created_at",
    size: 150,
    header: "Created At",
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
