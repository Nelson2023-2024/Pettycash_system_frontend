"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { AppDialog } from "@/components/ui/app-dialog";
import { DeleteAlert } from "@/components/ui/delete-alert";
import { topupColumns } from "@/components/topup/topup-columns";
import { TopUp } from "@/types/topup";
import { useGetAllTopUps, useDeactivateTopUp } from "@/hooks/useTopup";
import TopupForm from "./topup-form";
import TopupDecideForm from "./topup-decide-form";
import TopupDisburseForm from "./topup-disburse-form";

export default function TopupDataTable() {
  const { data: topups = [], isPending } = useGetAllTopUps();
  const { mutate: deactivateTopUp, isPending: isDeleting } =
    useDeactivateTopUp();

  const [editingTopup, setEditingTopup] = useState<TopUp | null>(null);
  const [deletingTopups, setDeletingTopups] = useState<TopUp[] | null>(null);
  const [reviewingTopup, setReviewingTopup] = useState<TopUp | null>(null);
  const [disbursingTopup, setDisbursingTopup] = useState<TopUp | null>(null);

  function handleEdit(rows: TopUp[]) {
    setEditingTopup(rows[0]);
  }

  function handleDelete(rows: TopUp[]) {
    setDeletingTopups(rows);
  }

  function handleReview(rows: TopUp[]) {
    const topup = rows[0];
    if (topup.status_code === "approved" || topup.status_code === "completed") {
      setDisbursingTopup(topup); // approved → disburse
    } else setReviewingTopup(rows[0]); // pending → approve/reject
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
        onReview={handleReview}
        reviewLabel="Review"
      />

      {/* ── Edit Dialog ── */}
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

      {/* ── Review Dialog ── */}
      <AppDialog
        open={reviewingTopup !== null}
        onOpenChange={(open) => {
          if (!open) setReviewingTopup(null);
        }}
        title="Review Top-Up Request"
        description="Approve or reject this top-up request."
      >
        {reviewingTopup && (
          <TopupDecideForm
            topup={reviewingTopup}
            onSuccess={() => setReviewingTopup(null)}
          />
        )}
      </AppDialog>

       {/* ── Disburse Dialog — approved → credit balance ── */}
      <AppDialog
        open={disbursingTopup !== null}
        onOpenChange={(open) => { if (!open) setDisbursingTopup(null); }}
        title="Disburse Top-Up"
        description="Confirm disbursement to credit the petty cash account."
      >
        {disbursingTopup && (
          <TopupDisburseForm
            topup={disbursingTopup}
            onSuccess={() => setDisbursingTopup(null)}
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
