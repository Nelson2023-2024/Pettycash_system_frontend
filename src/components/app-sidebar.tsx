"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

import { ChevronDown, User2, BadgeDollarSign } from "lucide-react";

import { useAuthMe } from "@/hooks/useAuth";
import { navConfig } from "@/config/navigation";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Spinner } from "./ui/spinner";

export function AppSidebar() {
  const { data: user, isLoading } = useAuthMe();
  const pathname = usePathname();

  const roleCode = user?.role ?? "Employee";

  const groups = navConfig[roleCode] ?? navConfig["Employee"];
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="font-semibold">
              <BadgeDollarSign className="text-primary" />
              <span>PettyCash</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* NAV */}
      <SidebarContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-svh px-4 py-2 text-sm  text-muted-foreground">
            <Spinner className="size-9 text-center" />
          </div>
        ) : (
          groups.map((group) => (
            <Collapsible
              key={group.label}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center">
                    {group.label}
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            tooltip={item.title}
                            isActive={pathname === item.href}
                          >
                            <Link href={item.href}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ))
        )}
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={user?.fullname ?? "User"}>
              <User2 />
              <div className="flex flex-col gap-0.5">
                <span>{user?.fullname ?? "..."}</span>
                <span className="text-primary">{user?.role}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
