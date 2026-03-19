import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Smartphone, TrendingUp, ShieldCheck, ShieldOff } from "lucide-react";
import { PettyCash } from "@/types/pettycash";
import { CardDropdown } from "../ui/card-dropdown";
import { StatusBadge } from "../ui/status-badge";
import { cn } from "@/lib/utils";

interface PettyCashCardProps {
  account: PettyCash;
  menuChildren?: React.ReactNode;
}

const fmt = (val: string) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(Number(val));

export const PettyCashCard = ({ account, menuChildren }: PettyCashCardProps) => {
  const isLow = Number(account.current_balance) <= Number(account.minimum_threshold);

  return (
    <Card className="w-72 gap-3">
      <CardHeader className="pb-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base leading-tight">{account.name}</CardTitle>
            <StatusBadge status={account.is_active ? "active" : "inactive"} />
          </div>
          <CardDescription className="text-xs line-clamp-1">
            {account.description}
          </CardDescription>
        </div>
        <CardAction>
          <CardDropdown>{menuChildren}</CardDropdown>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pb-0">
        <div className="rounded-md bg-muted/60 px-3 py-2.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-0.5">
              Balance
            </p>
            <p className={cn(
              "text-xl font-semibold tabular-nums",
              isLow ?  "text-(--status-failed-fg)" : "text-(--status-active-fg)"
            )}>
              {fmt(account.current_balance)}
            </p>
          </div>
          <TrendingUp className={cn(
            "size-7 opacity-20",
            isLow ? "text-(--status-failed-fg)" : "text-(--status-active-fg)"
          )} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Smartphone className="size-3 shrink-0" />
            <span className="truncate">{account.mpesa_phone_number}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground justify-end">
            {account.is_active
              ? <ShieldCheck className="size-3 text-(--status-active-fg)" />
              : <ShieldOff className="size-3" />
            }
            <span className="capitalize">{account.account_type}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-3">
        <div className="flex justify-between w-full text-xs text-muted-foreground">
          <span>Min. threshold</span>
          <span className="font-medium text-foreground tabular-nums">
            {fmt(account.minimum_threshold)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};