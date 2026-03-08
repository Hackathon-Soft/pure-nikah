import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Outlet, Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { Button } from "@/components/ui/button";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-navbar flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-lg px-token-4 sticky top-0 z-sticky">
            <div className="flex items-center gap-token-3">
              <SidebarTrigger className="text-muted-foreground" />
              <span className="text-token-sm text-muted-foreground hidden sm:inline">Dashboard</span>
            </div>
            <div className="flex items-center gap-token-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard/notifications">
                  <FiBell style={{ fontSize: "var(--size-icon)" }} />
                </Link>
              </Button>
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-xs font-bold">
                A
              </div>
            </div>
          </header>

          <main className="flex-1 bg-muted islamic-pattern">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
