import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  Receipt,
  Wallet,
  RefreshCcw,
  Users,
  Building2,
  ScrollText,
  BadgeDollarSign,
  LucideIcon,
  Bell,
} from "lucide-react";

export interface NavItem {
  title: string;
  icon: LucideIcon;
  href: string;
  permission: string; // ← matches exactly what backend sends
  showBadge?: boolean; // ← flag to indicate this item needs a badge
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// Every item is tied to one permission from your DB
// If user has that permission → item shows. Simple.
export const allNavItems: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        permission: "can_view_dashboard",
      },
      {
        title: "Petty Cash Account",
        icon: Wallet,
        href: "/account",
        permission: "can_view_petty_cash_account",
      },
    ],
  },
  {
    label: "My Expenses",
    items: [
      {
        title: "My Requests",
        icon: ClipboardList,
        href: "/expenses",
        permission: "can_view_own_expenses",
      },
      {
        title: "Reconciliations",
        icon: Receipt,
        href: "/reconciliations",
        permission: "can_view_own_reconciliations",
      },
    ],
  },
  {
    label: "Expense Requests",
    items: [
      {
        title: "All Expenses",
        icon: ScrollText,
        href: "/expenses/all",
        permission: "can_view_all_expenses",
      },
      {
        title: "All Reconciliations",
        icon: Receipt,
        href: "/reconciliations/all",
        permission: "can_view_all_reconciliations",
      },
    ],
  },
  {
    label: "Top-Up",
    items: [
      {
        title: "All Top-Ups",
        icon: RefreshCcw,
        href: "/topup",
        permission: "can_view_all_topups",
      },
      {
        title: "My Top-Ups",
        icon: BadgeDollarSign,
        href: "/topup/mine",
        permission: "can_view_own_topups",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Users",
        icon: Users,
        href: "/admin/users",
        permission: "can_view_all_departments",
      },
      {
        title: "Departments",
        icon: Building2,
        href: "/admin/departments",
        permission: "can_view_all_departments",
      },
    ],
  },
  {
    label: "Notifications",
    items: [
      {
        title: "Notifications",
        icon: Bell,
        href: "/notifications",
        permission: "can_view_notifications",
        showBadge: true,
      },
    ],
  },
];
