"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, ClipboardCheck } from "lucide-react";
import { Spinner } from "./spinner";

interface FilterColumn {
  column: string;
  placeholder: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumns?: FilterColumn[];
  isLoading?: boolean;
  onEdit?: (rows: TData[]) => void;
  onDelete?: (rows: TData[]) => void;
  onReview?: (rows: TData[]) => void; // ← added
  editLabel?: string;
  reviewLabel?: string; // ← added
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumns,
  isLoading = false,
  onEdit,
  onDelete,
  onReview,
  editLabel,
  reviewLabel,
}: DataTableProps<TData, TValue>) {
  "use no memo";

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="w-full">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {filterColumns?.map(({ column, placeholder }) => (
            <Input
              key={column}
              placeholder={placeholder}
              value={
                (table.getColumn(column)?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn(column)?.setFilterValue(e.target.value)
              }
              className="max-w-50"
            />
          ))}
        </div>

        {/* Action buttons — appear when rows are selected */}
        <div
          className="flex items-center gap-2 transition-all duration-200"
          style={{
            opacity: hasSelection ? 1 : 0,
            pointerEvents: hasSelection ? "auto" : "none",
          }}
        >
          {/* Edit — single row only */}
          {selectedRows.length === 1 && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(selectedRows)}
              className="flex items-center gap-2"
            >
              <Pencil className="h-3.5 w-3.5" />
              {editLabel ?? "Edit"}
            </Button>
          )}

          {/* Review — single row only */}
          {selectedRows.length === 1 && onReview && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReview(selectedRows)}
              className="flex items-center gap-2"
            >
              <ClipboardCheck className="h-3.5 w-3.5" />
              {reviewLabel ?? "Review"}
            </Button>
          )}

          {/* Delete — single or multiple rows */}
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(selectedRows)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete{selectedRows.length > 1 ? ` (${selectedRows.length})` : ""}
            </Button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center h-full">
                    <Spinner className="size-10" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={(e) => {
                    // Don't double-toggle if the click was directly on the checkbox
                    const target = e.target as HTMLElement;
                    if (target.closest('[role="checkbox"]')) return;
                    row.toggleSelected();
                  }}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex items-center justify-between py-4">
        <p className="text-sm text-muted-foreground">
          {selectedRows.length} of {table.getFilteredRowModel().rows.length}{" "}
          row(s) selected.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
