"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { AppDialog } from "@/components/ui/app-dialog";
import { DeleteAlert } from "@/components/ui/delete-alert";
import { topupColumns } from "@/components/topup/topup-columns";
import { TopUp } from "@/types/topup";
import { useGetAllTopUps, useDeactivateTopUp, useGetMyTopUps } from "@/hooks/useTopup";
import TopupForm from "./topup-form";

export default function TopupDataTable() {
  const { data: topups = [], isPending } = useGetMyTopUps()
  const { mutate: deactivateTopUp, isPending: isDeleting } = useDeactivateTopUp();

  const [editingTopup, setEditingTopup] = useState<TopUp | null>(null);
  const [deletingTopups, setDeletingTopups] = useState<TopUp[] | null>(null);

  function handleEdit(rows: TopUp[]) {
    setEditingTopup(rows[0]);
  }

  function handleDelete(rows: TopUp[]) {
    setDeletingTopups(rows);
  }

  function confirmDelete() {
    deletingTopups?.forEach((topup) =>
      deactivateTopUp(topup.id, {
        onSuccess: () => setDeletingTopups(null),
      }),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-semibold">Top-Up Requests</h1>
        <p className="text-sm text-muted-foreground">
          View and manage petty cash top-up requests
        </p>
      </div>

      {/* ── Table ── */}
      <DataTable
        columns={topupColumns}
        data={topups}
        isLoading={isPending}
        filterColumns={[
          { column: "status", placeholder: "Search by status..." },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ── Edit Dialog — only pending top-ups can be edited ── */}
      <AppDialog
        open={editingTopup !== null}
        onOpenChange={(open) => {
          if (!open) setEditingTopup(null);
        }}
        title="Edit Top-Up Request"
        description="Update your pending top-up request."
      >
        {editingTopup && (
          <TopupForm
            topup={editingTopup}
            onSuccess={() => setEditingTopup(null)}
          />
        )}
      </AppDialog>

      {/* ── Delete Alert ── */}
      <DeleteAlert
        open={deletingTopups !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingTopups(null);
        }}
        isPending={isDeleting}
        description={
          deletingTopups?.length === 1
            ? `This will permanently deactivate this top-up request. This action cannot be undone.`
            : `This will permanently deactivate ${deletingTopups?.length} top-up requests. This action cannot be undone.`
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}