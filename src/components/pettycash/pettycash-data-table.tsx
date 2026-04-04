"use client";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { pettyCashActivityColumns } from "./pettycash-columns";
import { useGetPettyCashActivity } from "@/hooks/usePettyCash";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";
import PettyCashExportButton from "./pettycash-export-button";

const fmt = (val: string) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(parseFloat(val));

const PettyCashDataTable = () => {
  const { data, isPending } = useGetPettyCashActivity();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-8" />
      </div>
    );
  }

  const account = data?.account;
  const activity = data?.activity ?? [];
  const isLow = account
    ? parseFloat(account.current_balance) <=
      parseFloat(account.minimum_threshold)
    : false;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ── Account Summary ── */}
      {account && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{account.name}</h1>
              <p className="text-sm text-muted-foreground">
                {account.description}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* ── Export button ── */}
              <PettyCashExportButton />
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Current Balance
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    isLow
                      ? "text-(--status-failed-fg)"
                      : "text-(--status-active-fg)",
                  )}
                >
                  {fmt(account.current_balance)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Min. threshold: {fmt(account.minimum_threshold)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Activity Table ── */}
      <DataTable
        columns={pettyCashActivityColumns}
        data={activity}
        isLoading={isPending}
        filterColumns={[
          { column: "event_code", placeholder: "Filter by event..." },
        ]}
      />
    </div>
  );
};

export default PettyCashDataTable;
