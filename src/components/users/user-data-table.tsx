"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { AppDialog } from "@/components/ui/app-dialog";
import { DeleteAlert } from "@/components/ui/delete-alert";
import { userColumns } from "@/components/users/user-columns";
import { User } from "@/types/user";
import { useGetAllUsers, useUpdateUser } from "@/hooks/useUser";
import UserForm from "./user-form";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export default function UserDataTable() {
  const { data: users = [], isPending } = useGetAllUsers();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUsers, setDeletingUsers] = useState<User[] | null>(null);

  function handleEdit(rows: User[]) {
    setEditingUser(rows[0]);
  }

  function handleDelete(rows: User[]) {
    setDeletingUsers(rows);
  }

  function confirmDelete() {
    deletingUsers?.forEach((user) =>
      updateUser(
        { user_id: user.id, payload: { is_active: false } },
        { onSuccess: () => setDeletingUsers(null) },
      ),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage your organization&apos;s users
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create User
        </Button>
      </div>

      {/* ── Table ── */}
      <DataTable
        columns={userColumns}
        data={users}
        isLoading={isPending}
        filterColumns={[
          { column: "first_name", placeholder: "Search by name..." },
          { column: "role", placeholder: "Search by role..." },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ── Create Dialog ── */}
      <AppDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create User"
        description="Fill in the details to create a new user account."
      >
        <UserForm onSuccess={() => setCreateOpen(false)} />
      </AppDialog>

      {/* ── Edit Dialog ── */}
      <AppDialog
        open={editingUser !== null}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null);
        }}
        title="Edit User"
        description="Update the details of this user account."
      >
        {editingUser && (
          <UserForm user={editingUser} onSuccess={() => setEditingUser(null)} />
        )}
      </AppDialog>

      {/* ── Delete Alert ── */}
      <DeleteAlert
        open={deletingUsers !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingUsers(null);
        }}
        isPending={isUpdating}
        description={
          deletingUsers?.length === 1
            ? `This will deactivate "${deletingUsers[0].first_name} ${deletingUsers[0].last_name}". This action cannot be undone.`
            : `This will deactivate ${deletingUsers?.length} users. This action cannot be undone.`
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}
