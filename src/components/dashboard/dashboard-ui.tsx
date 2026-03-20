"use client";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import { fmt, fmtCompact } from "./helpers";

// ── Stat Card ─────────────────────────────────────────────
export const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  className?: string;
}) => (
  <Card className={className}>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardDescription className="text-xs uppercase tracking-wide font-medium">
          {title}
        </CardDescription>
        <div className="rounded-md bg-muted p-1.5">
          <Icon className="size-3.5 text-muted-foreground" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-0.5 text-xs",
              trend === "up"
                ? "text-(--status-active-fg)"
                : trend === "down"
                  ? "text-(--status-failed-fg)"
                  : "text-muted-foreground",
            )}
          >
            {trend === "up" ? (
              <TrendingUp className="size-3.5" />
            ) : trend === "down" ? (
              <TrendingDown className="size-3.5" />
            ) : null}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// ── Status Row ────────────────────────────────────────────
export const StatusRow = ({
  label,
  value,
  status,
}: {
  label: string;
  value: number;
  status: string;
}) => (
  <div className="flex items-center justify-between py-1.5">
    <div className="flex items-center gap-2">
      <StatusBadge status={status} />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <span className="text-sm font-medium tabular-nums">{value}</span>
  </div>
);

// ── Action Alert ──────────────────────────────────────────
export const ActionAlert = ({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) => (
  <div
    className={cn(
      "flex items-center justify-between px-3 py-2.5 rounded-md",
      count > 0 ? "bg-muted/60" : "bg-muted/20 opacity-50",
    )}
  >
    <span className="text-sm">{label}</span>
    <span
      className="text-sm font-bold tabular-nums"
      style={{ color: count > 0 ? color : "var(--muted-foreground)" }}
    >
      {count}
    </span>
  </div>
);

// ── Custom Tooltip ────────────────────────────────────────
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 shadow-md text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-muted-foreground">
          {p.name === "total_amount"
            ? fmtCompact(p.value)
            : `${p.value} expenses`}
        </p>
      ))}
    </div>
  );
};

// ── Area Chart ────────────────────────────────────────────
export const DisbursementAreaChart = ({
  data,
  totalAllTime,
}: {
  data: { month: string; total_amount: number }[];
  totalAllTime: string;
}) => (
  <Card className="lg:col-span-2">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium">
        Monthly Disbursement
      </CardTitle>
      <CardDescription className="text-xs">
        Total amount disbursed per month (KES)
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={data}
          margin={{ top: 4, right: 8, left: 8, bottom: 20 }}
        >
          <defs>
            <linearGradient id="amountGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.split(" ")[0]}
            label={{
              value: "Month",
              position: "insideBottom",
              offset: -12,
              fontSize: 10,
              fill: "var(--muted-foreground)",
            }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => fmtCompact(v)}
            width={60}
            label={{
              value: "Amount (KES)",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fontSize: 10,
              fill: "var(--muted-foreground)",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total_amount"
            name="total_amount"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#amountGrad)"
            dot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "var(--primary)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground border-t border-border pt-3">
        <span>Total disbursed all time</span>
        <span className="font-medium text-foreground tabular-nums">
          {fmt(totalAllTime)}
        </span>
      </div>
    </CardContent>
  </Card>
);

// ── Bar Chart ─────────────────────────────────────────────
export const ExpenseVolumeBarChart = ({
  data,
}: {
  data: { month: string; total: number }[];
}) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium">Expense Volume</CardTitle>
      <CardDescription className="text-xs">
        Number of requests per month
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 8, left: 0, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.split(" ")[0]}
            label={{
              value: "Month",
              position: "insideBottom",
              offset: -12,
              fontSize: 10,
              fill: "var(--muted-foreground)",
            }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={30}
            label={{
              value: "Requests",
              angle: -90,
              position: "insideLeft",
              offset: 12,
              fontSize: 10,
              fill: "var(--muted-foreground)",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="total"
            name="total"
            fill="var(--primary)"
            radius={[3, 3, 0, 0]}
            opacity={0.85}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
