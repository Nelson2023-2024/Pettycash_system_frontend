"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/ui/status-badge";
import { Department } from "@/types/department";

export const departmentColumns: ColumnDef<Department>[] = [
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
  // ── Name ──
  {
    accessorKey: "name",
    size: 200,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.getValue("name")}</span>
    ),
  },

  // ── Code ──
  {
    accessorKey: "code",
    size: 100,
    header: "Code",
    cell: ({ row }) => (
      <span className="text-sm font-mono uppercase text-muted-foreground">
        {row.getValue("code")}
      </span>
    ),
  },

  // ── Description ──
  {
    accessorKey: "description",
    size: 300,
    header: "Description",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground line-clamp-1">
        {row.getValue("description")}
      </span>
    ),
  },

  // ── Line Manager ──
  {
    accessorKey: "line_manager",
    size: 200,
    header: "Line Manager",
    cell: ({ row }) => {
      const manager = row.getValue(
        "line_manager",
      ) as Department["line_manager"];
      if (!manager)
        return <span className="text-sm text-muted-foreground">—</span>;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{manager.name}</span>
          <span className="text-xs text-muted-foreground">{manager.email}</span>
        </div>
      );
    },
  },

  // ── Status ──
  {
    accessorKey: "is_active",
    size: 120,
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.getValue("is_active") ? "active" : "inactive"} />
    ),
  },
];
