"use client";
import React, { useState } from "react";
import { DataTable } from "../ui/data-table";
import { reconciliationColumns } from "./reconciliaion-columns";
import { useGetMyReconciliations } from "@/hooks/useReconciliation";
import { Reconciliation } from "@/types/reconciliation";
import { AppDialog } from "../ui/app-dialog";
import ReconciliationSubmitForm from "./reconciliation-sumbit-form";

const EmployeeReconciliationDataTable = () => {
  const { data: myReconciliations = [], isPending } = useGetMyReconciliations();
  const [submitting, setSubmitting] = useState<Reconciliation | null>(null);

  function handleEdit(rows: Reconciliation[]) {
    setSubmitting(rows[0]);
    console.log(rows);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">All Reconciliations</h1>
        <p className="text-sm text-muted-foreground">
          Review receipts for disbursed expenses
        </p>
      </div>
      <DataTable
        data={myReconciliations}
        columns={reconciliationColumns}
        isLoading={isPending}
        editLabel="Submit Receipt"
        filterColumns={[
          {
            column: "expense_request_title",
            placeholder: "Search by expense...",
          },
          { column: "status", placeholder: "Search by status..." },
        ]}
        onEdit={handleEdit}
      />

      <AppDialog
        open={submitting !== null}
        onOpenChange={(open) => {
          if (!open) setSubmitting(null);
        }}
        title="Submit Reconciliation"
        description="Upload your receipt and enter the amounts for this disbursement."
      >
        {submitting && (
          <ReconciliationSubmitForm
            reconciliation={submitting}
            onSuccess={() => setSubmitting(null)}
          />
        )}
      </AppDialog>
    </div>
  );
};

export default EmployeeReconciliationDataTable;
