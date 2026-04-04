"use client";
import { useState } from "react";
import { useSearchUsers } from "@/hooks/useUser";
import { User } from "@/types/user";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UserSearchComboboxProps {
  value?: string;        // selected user ID
  onChange: (id: string) => void;
  placeholder?: string;
}

export function UserSearchCombobox({
  value,
  onChange,
  placeholder = "Search by name or email...",
}: UserSearchComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users = [], isPending } = useSearchUsers(query);

  function handleSelect(user: User) {
    setSelectedUser(user);
    onChange(user.id);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between font-normal"
        >
          {selectedUser ? (
            <span>
              {selectedUser.first_name} {selectedUser.last_name}
              <span className="ml-1 text-xs text-muted-foreground">
                ({selectedUser.email})
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type name or email..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {isPending && (
              <CommandEmpty>Searching...</CommandEmpty>
            )}
            {!isPending && query.length < 2 && (
              <CommandEmpty>Type at least 2 characters to search.</CommandEmpty>
            )}
            {!isPending && query.length >= 2 && users.length === 0 && (
              <CommandEmpty>No users found.</CommandEmpty>
            )}
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => handleSelect(user)}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value === user.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {user.first_name} {user.last_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}