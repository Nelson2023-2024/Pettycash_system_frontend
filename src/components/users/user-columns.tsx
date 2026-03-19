"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/ui/status-badge";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const userColumns: ColumnDef<User>[] = [
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

  // ── Name ──
  {
    accessorKey: "first_name",
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
    cell: ({ row }) => {
      const user = row.original;
      const initials =
        `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <Avatar className="border">
            <AvatarImage src={user.avatar_url ?? undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user.first_name} {user.last_name}
            </span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },

  // ── Role ──
  {
    accessorKey: "role",
    size: 150,
    header: "Role",
    cell: ({ row }) => <span className="text-sm">{row.getValue("role")}</span>,
  },

  // ── Department ──
  {
    accessorKey: "department",
    size: 180,
    header: "Department",
    cell: ({ row }) => {
      const dept = row.getValue("department") as User["department"];
      if (!dept)
        return <span className="text-sm text-muted-foreground">—</span>;
      return <span className="text-sm">{dept.name}</span>;
    },
  },

  // ── Phone ──
  {
    accessorKey: "phone_number",
    size: 140,
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone_number") as string;
      if (!phone)
        return <span className="text-sm text-muted-foreground">—</span>;
      return <span className="text-sm">{phone}</span>;
    },
  },

  // ── Status ──
  {
    accessorKey: "status",
    size: 120,
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
];
