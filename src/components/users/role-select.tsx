// components/ui/role-select.tsx
"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllRoles } from "@/hooks/useRole";
import { Spinner } from "../ui/spinner";

interface RoleSelectProps {
  value?: string;
  onChange: (id: string) => void;
  placeholder?: string;
}

export function RoleSelect({
  value,
  onChange,
  placeholder = "Select a role",
}: RoleSelectProps) {
  const { data: roles = [], isPending } = useGetAllRoles();

  return (
    <Select value={value} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger>
        {isPending ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Spinner className="size-6" /> Loading Roles ...
          </div>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role.id} value={role.code}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
