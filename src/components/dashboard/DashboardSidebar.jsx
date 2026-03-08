import {
  FiHome, FiUser, FiSearch, FiHeart, FiMessageSquare, FiBell,
  FiSettings, FiShield, FiStar, FiEdit, FiCamera, FiSliders, FiEye, FiSlash,
} from "react-icons/fi";
import { NavLink } from "@/components/NavLink";
import { useLocation, Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: FiHome },
  { title: "My Profile", url: "/dashboard/profile", icon: FiUser },
  { title: "Edit Profile", url: "/dashboard/edit-profile", icon: FiEdit },
  { title: "Photos", url: "/dashboard/photos", icon: FiCamera },
  { title: "Preferences", url: "/dashboard/preferences", icon: FiSliders },
];

const matchItems = [
  { title: "Search", url: "/dashboard/search", icon: FiSearch },
  { title: "Nearby Matches", url: "/dashboard/nearby", icon: FiSearch },
  { title: "Interests", url: "/dashboard/interests", icon: FiHeart },
  { title: "Who Viewed Me", url: "/dashboard/who-viewed-me", icon: FiEye },
  { title: "Favorites", url: "/dashboard/favorites", icon: FiStar },
  { title: "Messages", url: "/dashboard/messages", icon: FiMessageSquare },
];

const accountItems = [
  { title: "Verification", url: "/dashboard/verification", icon: FiShield },
  { title: "Notifications", url: "/dashboard/notifications", icon: FiBell },
  { title: "Blocked Users", url: "/dashboard/blocked-users", icon: FiSlash },
  { title: "Settings", url: "/dashboard/settings", icon: FiSettings },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const renderGroup = (label, items) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                  <item.icon className="mr-2 h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-token-4">
        <Link to="/" className="flex items-center gap-token-2">
          <FaHeart className="text-primary flex-shrink-0" style={{ fontSize: "var(--size-icon-lg)" }} />
          {!collapsed && (
            <span className="font-display text-token-lg font-bold text-foreground">PureNikah</span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {renderGroup("Main", mainItems)}
        {renderGroup("Matches", matchItems)}
        {renderGroup("Account", accountItems)}
      </SidebarContent>

      <SidebarFooter className="p-token-4">
        {!collapsed && (
          <div className="flex items-center gap-token-3 p-token-2 rounded-lg bg-muted">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-sm font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-token-sm font-medium text-foreground truncate">Ahmed Khan</p>
              <p className="text-token-xs text-muted-foreground truncate">ahmed@email.com</p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
