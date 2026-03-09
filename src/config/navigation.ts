import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  Receipt,
  Wallet,
  CheckSquare,
  RefreshCcw,
  Users,
  Building2,
  Settings,
  ScrollText,
  BadgeDollarSign,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  icon: LucideIcon;
  href: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navConfig: Record<string, NavGroup[]> = {
  Employee: [
    {
      label: "My Expenses",
      items: [
        { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { title: "New Request", icon: FilePlus, href: "/expenses/new" },
        { title: "My Requests", icon: ClipboardList, href: "/expenses" },
        { title: "Reconciliations", icon: Receipt, href: "/reconciliations" },
      ],
    },
  ],

  "Finance Officer": [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { title: "Petty Cash Account", icon: Wallet, href: "/account" },
      ],
    },
    {
      label: "Expense Requests",
      items: [
        {
          title: "Pending Approval",
          icon: ClipboardList,
          href: "/expenses/pending",
        },
        { title: "All Requests", icon: ScrollText, href: "/expenses" },
      ],
    },
    {
      label: "Reconciliations",
      items: [
        {
          title: "Under Review",
          icon: CheckSquare,
          href: "/reconciliations/review",
        },
        {
          title: "All Reconciliations",
          icon: Receipt,
          href: "/reconciliations",
        },
      ],
    },
    {
      label: "Top-Up",
      items: [
        { title: "Request Top-Up", icon: BadgeDollarSign, href: "/topup/new" },
        { title: "Top-Up History", icon: RefreshCcw, href: "/topup" },
      ],
    },
  ],

  "Chief Finance Officer": [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { title: "Petty Cash Account", icon: Wallet, href: "/account" },
      ],
    },
    {
      label: "Approvals",
      items: [
        {
          title: "Top-Up Approvals",
          icon: CheckSquare,
          href: "/topup/pending",
        },
        { title: "All Top-Ups", icon: RefreshCcw, href: "/topup" },
        { title: "All Expenses", icon: ScrollText, href: "/expenses" },
      ],
    },
    {
      label: "Reports",
      items: [
        { title: "Reconciliations", icon: Receipt, href: "/reconciliations" },
        { title: "Audit Logs", icon: ScrollText, href: "/logs" },
      ],
    },
  ],

  Admin: [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { title: "Petty Cash Account", icon: Wallet, href: "/account" },
      ],
    },
    {
      label: "Management",
      items: [
        { title: "Users", icon: Users, href: "/admin/users" },
        { title: "Departments", icon: Building2, href: "/admin/departments" },
        { title: "Audit Logs", icon: ScrollText, href: "/admin/logs" },
      ],
    },
    {
      label: "Settings",
      items: [
        { title: "System Settings", icon: Settings, href: "/admin/settings" },
      ],
    },
  ],
};
