"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { AppDialog } from "@/components/ui/app-dialog";
import { expenseColumns } from "@/components/expenses/expense-columns";
import { ExpenseRequestForm } from "@/components/expenses/expense-request-form";
import {
  useGetAuthUserExpenses,
  useDeactivateExpense,
} from "@/hooks/useExpense";
import { Expense } from "@/types/expense";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ExpenseDataTable() {
  const { data: expenses = [], isPending } = useGetAuthUserExpenses();
  const { mutate: deactivateExpense } = useDeactivateExpense();

  // Controls whether the create dialog is open
  const [createOpen, setCreateOpen] = useState(false);

  function handleEdit(rows: Expense[]) {
    const expense = rows[0];
    console.log("Edit expense:", expense);
    // 👉 you'll wire up an edit dialog here later
  }

  function handleDelete(rows: Expense[]) {
    rows.forEach((expense) => deactivateExpense(expense.id));
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header: title + create button ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Expenses</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your expense requests
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Expense
        </Button>
      </div>

      {/* ── Table ── */}
      <DataTable
        columns={expenseColumns}
        data={expenses}
        isLoading={isPending}
        filterColumns={[
          { column: "title", placeholder: "Search by title..." },
          { column: "status", placeholder: "Search by status..." },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ── Create Expense Dialog ── */}
      <AppDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Expense"
        description="Fill in the details below to submit a new expense request."
      >
        {/* Just drop any form/component here as a child */}
        <ExpenseRequestForm onSuccess={() => setCreateOpen(false)} />
      </AppDialog>
    </div>
  );
}
