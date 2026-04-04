"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { AppDialog } from "@/components/ui/app-dialog";
import { loanColumns } from "./loan-column";
import LoanDecisionForm from "./loan-decision-form";
import { useGetAllLoans } from "@/hooks/useLoan";
import { Loan } from "@/types/loan";
import { LoanDisburseForm } from "./loan-disbursment-form";

export default function AdminLoanDataTable() {
  const { data: loans = [], isPending } = useGetAllLoans();
  const [decidingLoan, setDecidingLoan] = useState<Loan | null>(null);
  const [disbursingLoan, setDisbursingLoan] = useState<Loan | null>(null);

  function handleReview(rows: Loan[]) {
    const loan = rows[0];
    console.log(rows[0]);
    if (["approved", "disbursed"].includes(loan.status_code)) {
      setDisbursingLoan(loan);
    } else {
      setDecidingLoan(loan);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-semibold">All Loans</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all loan requests across the organization
        </p>
      </div>

      {/* ── Table ── */}
      <DataTable
        columns={loanColumns}
        data={loans}
        isLoading={isPending}
        filterColumns={[
          { column: "status_code", placeholder: "Filter by status..." },
        ]}
        onReview={handleReview}
      />

      {/* ── Decision Dialog ── */}
      <AppDialog
        open={decidingLoan !== null}
        onOpenChange={(open) => {
          if (!open) setDecidingLoan(null);
        }}
        title="Loan Decision"
        description="Approve or reject this loan request."
      >
        {decidingLoan && (
          <LoanDecisionForm
            loan={decidingLoan}
            onSuccess={() => setDecidingLoan(null)}
          />
        )}
      </AppDialog>

      {/* ── Disburse Dialog ── */}
      <AppDialog
        open={disbursingLoan !== null}
        onOpenChange={(open) => {
          if (!open) setDisbursingLoan(null);
        }}
        title="Disburse Loan"
        description="Confirm disbursement of this approved loan."
      >
        {disbursingLoan && (
          <LoanDisburseForm
            loan={disbursingLoan}
            onSuccess={() => setDisbursingLoan(null)}
          />
        )}
      </AppDialog>
    </div>
  );
}
