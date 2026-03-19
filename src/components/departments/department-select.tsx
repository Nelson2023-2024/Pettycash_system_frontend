"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { Spinner } from "../ui/spinner";

interface DepartmentSelectProps {
  value?: string;
  onChange: (id: string) => void;
  placeholder?: string;
}

export function DepartmentSelect({
  value,
  onChange,
  placeholder = "select a department",
}: DepartmentSelectProps) {
  const { data: departments = [], isPending } = useGetAllDepartments();
  return (
    <Select value={value} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger>
        <SelectValue
          placeholder={
            isPending ? (
              <>
                <Spinner className="text-center size-6"/> Loading Departments....
              </>
            ) : (
              placeholder
            )
          }
        />
      </SelectTrigger>
      <SelectContent>
        {departments.map((department) => (
          <SelectItem key={department.id} value={department.id}>
            {department.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
