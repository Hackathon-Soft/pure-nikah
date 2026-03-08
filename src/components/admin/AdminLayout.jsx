import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiShield } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AdminSidebar } from "./AdminSidebar";

const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-lg px-4 sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground" />
              <div className="flex items-center gap-2">
                <FiShield className="text-primary" />
                <span className="text-sm font-semibold text-foreground">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">Back to Dashboard</Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
                <FiLogOut className="text-lg" />
              </Button>
            </div>
          </header>
          <main className="flex-1 bg-muted">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
