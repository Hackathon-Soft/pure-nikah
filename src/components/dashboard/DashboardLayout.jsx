import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { FiBell, FiLogOut } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const MarriedRestrictionScreen = ({ onSignOut }) => (
  <div className="min-h-screen bg-muted islamic-pattern flex items-center justify-center p-6">
    <div className="max-w-md w-full text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto text-4xl">
        💍
      </div>
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Mubarak! Profile Closed
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your profile has been marked as <span className="font-semibold text-primary">Married via PureNikah</span> by the administrator. Alhamdulillah! Your account is now closed as you have found your life partner.
        </p>
      </div>
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-sm text-muted-foreground">
        <p>If you believe this is a mistake, please contact our support team at <span className="text-primary font-medium">support@purenikah.com</span></p>
      </div>
      <Button variant="outline" onClick={onSignOut} className="w-full">
        <FiLogOut className="mr-2" />
        Sign Out
      </Button>
    </div>
  </div>
);

const DashboardLayout = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Block access for married users
  if (profile?.is_married) {
    return <MarriedRestrictionScreen onSignOut={handleSignOut} />;
  }

  const initial = profile?.first_name?.charAt(0)?.toUpperCase() || "U";

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
              <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
                <FiLogOut style={{ fontSize: "var(--size-icon)" }} />
              </Button>
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-xs font-bold">
                {initial}
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
