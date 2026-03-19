"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { AppDialog } from "@/components/ui/app-dialog";
import { expenseColumns } from "@/components/expenses/expense-columns";
import { ExpenseDecideForm } from "@/components/expenses/expense-decide-form";
import { ExpenseDisburseForm } from "@/components/expenses/expense-disburse-form";
import { useGetAllExpenses } from "@/hooks/useExpense";
import { Expense } from "@/types/expense";

export default function AdminExpenseDataTable() {
  const { data: expenses = [], isPending } = useGetAllExpenses();
  

  const [decidingExpense, setDecidingExpense] = useState<Expense | null>(null);
  const [disbursingExpense, setDisbursingExpense] = useState<Expense | null>(null);

  function handleEdit(rows: Expense[]) {
    const expense = rows[0];

    // Route to the right dialog based on status
    if (expense.status.toLowerCase() === "approved") {
      setDisbursingExpense(expense); // approved → disburse
    } else {
      setDecidingExpense(expense);   // pending → approve/reject
    }
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-semibold">All Expenses</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve, reject or disburse expense requests
        </p>
      </div>

      {/* ── Table — no delete for FO/CFO ── */}
      <DataTable
        columns={expenseColumns}
        data={expenses}
        isLoading={isPending}
        filterColumns={[
          { column: "title", placeholder: "Search by title..." },
          { column: "status", placeholder: "Search by status..." },
        ]}
        onEdit={handleEdit}
        editLabel="Review"
      />

      {/* ── Decide Dialog (pending expenses) ── */}
      <AppDialog
        open={decidingExpense !== null}
        onOpenChange={(open) => { if (!open) setDecidingExpense(null); }}
        title="Review Expense"
        description="Approve or reject this expense request."
      >
        {decidingExpense && (
          <ExpenseDecideForm
            expense={decidingExpense}
            onSuccess={() => setDecidingExpense(null)}
          />
        )}
      </AppDialog>

      {/* ── Disburse Dialog (approved expenses) ── */}
      <AppDialog
        open={disbursingExpense !== null}
        onOpenChange={(open) => { if (!open) setDisbursingExpense(null); }}
        title="Disburse Expense"
        description="Confirm disbursement of this approved expense."
      >
        {disbursingExpense && (
          <ExpenseDisburseForm
            expense={disbursingExpense}
            onSuccess={() => setDisbursingExpense(null)}
          />
        )}
      </AppDialog>

    </div>
  );
}
