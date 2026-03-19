"use client";

import ExpenseDataTable from "@/components/expenses/expense-data-table";

export default function MyExpenses() {
  return (
    <>
      <div className="w-[80%] mx-auto">
        <ExpenseDataTable />
      </div>
    </>
  );
}
