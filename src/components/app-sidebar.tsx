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
import { ChevronDown, BadgeDollarSign } from "lucide-react";
import { useAuthMe } from "@/hooks/useAuth";
import { allNavItems } from "@/config/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Spinner } from "./ui/spinner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useGetMyNotifications } from "@/hooks/useNotifications";
import { Badge } from "./ui/badge";

export function AppSidebar() {
  const { data: user, isLoading } = useAuthMe();
  const pathname = usePathname();
  console.log(user);
  const initials = user?.fullname
    ? user.fullname
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : "??";

  const permissions = new Set(user?.permissions ?? []);

  // ── fetch unread count for notification badge ─────────
  const { data: notificationData } = useGetMyNotifications(1, 1);
  const unreadCount = notificationData?.unread_count ?? 0;

  // Filter each group's items to only what the user has permission for
  // Then drop empty groups entirely
  const visibleGroups = allNavItems
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => permissions.has(item.permission)),
    }))
    .filter((group) => group.items.length > 0);

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
          <div className="flex justify-center items-center h-svh">
            <Spinner className="size-9" />
          </div>
        ) : (
          visibleGroups.map((group) => (
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
                              {/* Badge for notifications */}
                              {item.showBadge && unreadCount > 0 && (
                                <Badge variant={"destructive"}>
                                  {" "}
                                  {unreadCount > 99 ? "99+" : unreadCount}
                                </Badge>
                              )}
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
            <SidebarMenuButton asChild tooltip={user?.fullname ?? "User"}>
              <Link href={"/profile"}>
                <Avatar>
                  <AvatarImage
                    src={user?.avatar_url ?? "/placeholder-avatar.png"}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                  <span>{user?.fullname ?? "..."}</span>
                  <span className="text-xs text-primary">{user?.role}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
