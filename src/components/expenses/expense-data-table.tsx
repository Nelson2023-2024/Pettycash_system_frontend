"use client";

import { DataTable } from "@/components/ui/data-table";
import { expenseColumns } from "@/components/expenses/expense-columns";
import { useGetAuthUserExpenses, useDeactivateExpense } from "@/hooks/useExpense";
import { Expense } from "@/types/expense";

export default function ExpenseDataTable() {
  const { data: expenses = [], isPending } = useGetAuthUserExpenses();
  const { mutate: deactivateExpense } = useDeactivateExpense();

  function handleEdit(rows: Expense[]) {
    const expense = rows[0];
    console.log("Edit expense:", expense);
    // 👉 open your edit modal here
  }

  function handleDelete(rows: Expense[]) {
    rows.forEach((expense) => deactivateExpense(expense.id));
  }

  return (
    <DataTable
      columns={expenseColumns}
      data={expenses}
      isLoading={isPending}
      filterColumns={[
        { column: "title",  placeholder: "Search by title..."  },
        { column: "status", placeholder: "Search by status..." },
      ]}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}