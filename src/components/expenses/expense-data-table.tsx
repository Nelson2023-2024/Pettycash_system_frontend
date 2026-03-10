"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useGetAuthUserExpenses } from "@/hooks/useExpense";

export default function ExpenseDataTable() {
  const { data: expenses, isPending } = useGetAuthUserExpenses();
  return (
    <div className="overflow-x-auto border rounded">
      <Table className="min-w-175">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {expenses?.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-6 text-4xl font-bold"
              >
                No expenses found
              </TableCell>
            </TableRow>
          )}

          {expenses?.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.title}</TableCell>

              <TableCell>KES {expense.amount}</TableCell>

              <TableCell className="capitalize">
                {expense.expense_type}
              </TableCell>

              <TableCell className="capitalize">{expense.status}</TableCell>

              <TableCell>
                {new Date(expense.created_at).toLocaleDateString()}
              </TableCell>

              <TableCell>
                <button className="text-blue-600 hover:underline">View</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
