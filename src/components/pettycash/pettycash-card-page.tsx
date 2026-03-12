"use client";
import React, { useState } from "react";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Pencil, Trash2 } from "lucide-react";
import { PettyCash } from "@/types/pettycash";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { AppDialog } from "../ui/app-dialog";
import { DeleteAlert } from "../ui/delete-alert";
import { useDeactivatePettyCash, useGetPettyCashAccounts } from "@/hooks/usePettyCash";
import { PettyCashCard } from "./pettycash-card";
import PettyCashCreateForm from "./pettycash-create-form";
import { PettyCashEditForm } from "./pettycash-edit-form";

const PettyCashCardPage = () => {
  const { data: accounts, isPending } = useGetPettyCashAccounts();
  const { mutate: deactivatePettyCash, isPending: isDeleting } = useDeactivatePettyCash();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<PettyCash | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<PettyCash | null>(null);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Petty Cash Accounts</h2>
        <Button onClick={() => setCreateOpen(true)}>Create Pettycash</Button>
      </div>

      {accounts?.length === 0 && (
        <p className="text-sm text-muted-foreground">No accounts found.</p>
      )}

      <div className="flex flex-wrap gap-4">
        {accounts?.map((account) => (
          <PettyCashCard
            key={account.id}
            account={account}
            menuChildren={
              <>
                <DropdownMenuItem onClick={() => setEditingAccount(account)}>
                  <Pencil className="size-3.5" /> Edit account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setDeletingAccount(account)}
                >
                  <Trash2 className="size-3.5" /> Delete
                </DropdownMenuItem>
              </>
            }
          />
        ))}
      </div>

      <AppDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Petty Cash Account"
        description="Fill in the details to create a new petty cash account."
      >
        <PettyCashCreateForm onSuccess={() => setCreateOpen(false)} />
      </AppDialog>

      <AppDialog
        open={editingAccount !== null}
        onOpenChange={(open) => { if (!open) setEditingAccount(null); }}
        title="Edit Petty Cash Account"
        description="Update the details of this petty cash account."
      >
        {editingAccount && (
          <PettyCashEditForm
            account={editingAccount}
            onSuccess={() => setEditingAccount(null)}
          />
        )}
      </AppDialog>

      <DeleteAlert
        open={deletingAccount !== null}
        onOpenChange={(open) => { if (!open) setDeletingAccount(null); }}
        isPending={isDeleting}
        description={`This will permanently delete "${deletingAccount?.name}". This action cannot be undone.`}
        onConfirm={() => {
          if (deletingAccount) {
            deactivatePettyCash(deletingAccount.id, {
              onSuccess: () => setDeletingAccount(null),
            });
          }
        }}
      />
    </div>
  );
};

export default PettyCashCardPage;
