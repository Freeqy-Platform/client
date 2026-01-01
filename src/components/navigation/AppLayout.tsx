import AppHeader from "./AppHeader";
import MinimalFooter from "./MinimalFooter";
import AppSidebar from "./AppSidebar";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useSidebarConfig } from "@/hooks/useSidebarConfig";

const AppLayout = () => {
  const sidebarConfig = useSidebarConfig();

  return (
    <SidebarProvider defaultOpen={true}>
      <AppHeader />
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden pt-16">
        <div className="flex flex-1 w-full min-w-0">
          {sidebarConfig && <AppSidebar config={sidebarConfig} />}
          <SidebarInset className="flex-1 min-w-0 w-full">
            <Outlet />
          </SidebarInset>
        </div>
        <MinimalFooter />
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
