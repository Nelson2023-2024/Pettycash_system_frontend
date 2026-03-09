import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChildrenProps } from "@/types/common";
import React from "react";

const DashboardLayout = ({ children }: ChildrenProps) => {
  return <>
  <SidebarProvider>
    <AppSidebar/>
    <main>
        <SidebarTrigger/>
        {children}
    </main>
  </SidebarProvider>
  </>;
};

export default DashboardLayout;
