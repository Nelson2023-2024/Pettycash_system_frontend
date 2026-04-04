"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { AppDialog } from "@/components/ui/app-dialog";
import { DeleteAlert } from "@/components/ui/delete-alert";
import { loanColumns } from "./loan-column";
import LoanRequestForm from "./loan-request.form";
import LoanDecisionForm from "./loan-decision-form";
import { useGetMyLoans, useDeactivateLoan } from "@/hooks/useLoan";
import { Loan } from "@/types/loan";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function EmployeeLoanDataTable() {
  const { data: myLoans = [], isPending } = useGetMyLoans();
  const { mutate: deactivateLoan, isPending: isDeleting } = useDeactivateLoan();

  const [createOpen, setCreateOpen] = useState(false);
  const [decidingLoan, setDecidingLoan] = useState<Loan | null>(null);
  const [deletingLoans, setDeletingLoans] = useState<Loan[] | null>(null);

  function handleEdit(rows: Loan[]) {
    setDecidingLoan(rows[0]);
  }

  function handleDelete(rows: Loan[]) {
    setDeletingLoans(rows);
  }

  function confirmDelete() {
    deletingLoans?.forEach((loan) =>
      deactivateLoan(loan.id, {
        onSuccess: () => setDeletingLoans(null),
      }),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Loans</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your loan requests
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Request Loan
        </Button>
      </div>

      {/* ── Table ── */}
      <DataTable
        columns={loanColumns}
        data={myLoans}
        isLoading={isPending}
        filterColumns={[
          { column: "status_code", placeholder: "Filter by status..." },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ── Create Dialog ── */}
      <AppDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Request Loan"
        description="Fill in the details to submit a new loan request."
      >
        <LoanRequestForm onSuccess={() => setCreateOpen(false)} />
      </AppDialog>

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
          <LoanRequestForm
            loan={decidingLoan}
            onSuccess={() => setDecidingLoan(null)}
          />
        )}
      </AppDialog>

      {/* ── Delete Alert ── */}
      <DeleteAlert
        open={deletingLoans !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingLoans(null);
        }}
        isPending={isDeleting}
        description={
          deletingLoans?.length === 1
            ? `This will cancel the loan request for "${deletingLoans[0].reason}". This action cannot be undone.`
            : `This will cancel ${deletingLoans?.length} loan requests. This action cannot be undone.`
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}
