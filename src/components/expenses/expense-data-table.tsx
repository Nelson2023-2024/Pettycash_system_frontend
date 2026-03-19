"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { AppDialog } from "@/components/ui/app-dialog";
import { expenseColumns } from "@/components/expenses/expense-columns";
import { ExpenseRequestForm } from "@/components/expenses/expense-request-form";
import { ExpenseEditForm } from "@/components/expenses/expense-edit-form";
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

  const [createOpen, setCreateOpen] = useState(false);

  // Tracks which expense is being edited — null means dialog is closed
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  function handleEdit(rows: Expense[]) {
    setEditingExpense(rows[0]); // 👈 opens the edit dialog with that expense
  }

  function handleDelete(rows: Expense[]) {
    rows.forEach((expense) => deactivateExpense(expense.id));
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header ── */}
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

      {/* ── Create Dialog ── */}
      <AppDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Expense"
        description="Fill in the details below to submit a new expense request."
      >
        <ExpenseRequestForm onSuccess={() => setCreateOpen(false)} />
      </AppDialog>

      {/* ── Edit Dialog ── */}
      {/* editingExpense !== null controls open state */}
      <AppDialog
        open={editingExpense !== null}
        onOpenChange={(open) => {
          if (!open) setEditingExpense(null); // 👈 clears selection when closed
        }}
        title="Edit Expense"
        description="Update the details of your expense request."
      >
        {editingExpense && (
          <ExpenseEditForm
            expense={editingExpense}
            onSuccess={() => setEditingExpense(null)} // 👈 closes dialog on success
          />
        )}
      </AppDialog>
    </div>
  );
}
