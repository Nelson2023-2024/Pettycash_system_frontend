"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { AppDialog } from "@/components/ui/app-dialog";
import { DeleteAlert } from "@/components/ui/delete-alert";
import { departmentColumns } from "@/components/departments/department-columns";
import DepartmentForm from "@/components/departments/department-form";
import {
  useGetAllDepartments,
  useDeactivateDepartment,
} from "@/hooks/useDepartment";
import { Department } from "@/types/department";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DepartmentDataTable() {
  const { data: departments = [], isPending } = useGetAllDepartments();
  const { mutate: deactivateDepartment, isPending: isDeleting } =
    useDeactivateDepartment();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );
  const [deletingDepartments, setDeletingDepartments] = useState<
    Department[] | null
  >(null);

  function handleEdit(rows: Department[]) {
    setEditingDepartment(rows[0]);
  }

  function handleDelete(rows: Department[]) {
    setDeletingDepartments(rows);
  }

  function confirmDelete() {
    deletingDepartments?.forEach((dept) =>
      deactivateDepartment(dept.id, {
        onSuccess: () => setDeletingDepartments(null),
      }),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Departments</h1>
          <p className="text-sm text-muted-foreground">
            Manage your organizational departments
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Department
        </Button>
      </div>

      {/* ── Table ── */}
      <DataTable
        columns={departmentColumns}
        data={departments}
        isLoading={isPending}
        filterColumns={[
          { column: "name", placeholder: "Search by name..." },
          { column: "code", placeholder: "Search by code..." },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ── Create Dialog ── */}
      <AppDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Department"
        description="Fill in the details to create a new department."
      >
        <DepartmentForm
          className="max-w-none"
          onSuccess={() => setCreateOpen(false)}
        />
      </AppDialog>

      {/* ── Edit Dialog ── */}
      <AppDialog
        open={editingDepartment !== null}
        onOpenChange={(open) => {
          if (!open) setEditingDepartment(null);
        }}
        title="Edit Department"
        description="Update the details of this department."
      >
        {editingDepartment && (
          <DepartmentForm
            className="max-w-none"
            department={editingDepartment}
            onSuccess={() => setEditingDepartment(null)}
          />
        )}
      </AppDialog>

      {/* ── Delete Alert ── */}
      <DeleteAlert
        open={deletingDepartments !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingDepartments(null);
        }}
        isPending={isDeleting}
        description={
          deletingDepartments?.length === 1
            ? `This will permanently deactivate "${deletingDepartments[0].name}". This action cannot be undone.`
            : `This will permanently deactivate ${deletingDepartments?.length} departments. This action cannot be undone.`
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}
