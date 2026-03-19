import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu";
import { CircleEllipsis } from "lucide-react";

// ── Reusable central dropdown ─────────────────────────────
interface CardDropdownProps {
  children: React.ReactNode;
}

export const CardDropdown = ({ children }: CardDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-muted-foreground hover:text-foreground transition-colors rounded-md p-0.5 hover:bg-accent outline-none">
          <CircleEllipsis className="size-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};