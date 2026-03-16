"use client";
import React, { useState } from "react";
import { DataTable } from "../ui/data-table";
import { reconciliationColumns } from "./reconciliaion-columns";
import {
  useGetAllReconciliations,
  useGetMyReconciliations,
} from "@/hooks/useReconciliation";
import { Reconciliation } from "@/types/reconciliation";
import { AppDialog } from "../ui/app-dialog";
import ReconciliationSubmitForm from "./reconciliation-sumbit-form";
import { ReconciliationReviewForm } from "./review-reconciliation-form";

const FoReconciliationDataTable = () => {
  const { data: myReconciliations = [], isPending } =
    useGetAllReconciliations();
  const [reviewing, setReviewing] = useState<Reconciliation | null>(null);

  function handleReview(rows: Reconciliation[]) {
    setReviewing(rows[0]);
    console.log(rows);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">My Reconciliations</h1>
        <p className="text-sm text-muted-foreground">
          Submit receipts for your disbursed expenses
        </p>
      </div>
      <DataTable
        data={myReconciliations}
        columns={reconciliationColumns}
        isLoading={isPending}
        reviewLabel="Review"
        onReview={handleReview}
        filterColumns={[
          {
            column: "expense_request_title",
            placeholder: "Search by expense...",
          },
          { column: "status", placeholder: "Search by status..." },
        ]}
      />

      <AppDialog
        open={reviewing !== null}
        onOpenChange={(open) => {
          if (!open) setReviewing(null);
        }}
        title="Review Reconciliation"
        description="Upload your receipt and enter the amounts for this disbursement."
      >
        {reviewing && (
          <ReconciliationReviewForm
            reconciliation={reviewing}
            onSuccess={() => setReviewing(null)}
          />
        )}
      </AppDialog>
    </div>
  );
};

export default FoReconciliationDataTable;
