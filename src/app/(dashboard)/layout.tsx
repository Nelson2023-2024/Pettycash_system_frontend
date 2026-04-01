import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChildrenProps } from "@/types/common";
import RightContent from "@/components/navbar/right-content";

const DashboardLayout = ({ children }: ChildrenProps) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-col w-full">
          <header className="border-b h-12 flex justify-between items-center pr-8 sticky top-0 bg-background">
            <SidebarTrigger />
            <RightContent/>
          </header>
          {children}
        </main>
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;
