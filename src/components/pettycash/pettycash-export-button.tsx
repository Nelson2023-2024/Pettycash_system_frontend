"use client";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExportPettyCashActivity } from "@/hooks/usePettyCash";

const PettyCashExportButton = () => {
  const { mutate: exportActivity, isPending } = useExportPettyCashActivity();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" disabled={isPending}>
          <Download className="size-4" />
          {isPending ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportActivity("weekly")}>
          Weekly — Last 7 days
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportActivity("monthly")}>
          Monthly — Last 30 days
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PettyCashExportButton;