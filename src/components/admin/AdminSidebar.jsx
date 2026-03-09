import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { FiHome, FiUsers, FiCheckCircle, FiAlertTriangle, FiSettings, FiHeart, FiBarChart2, FiMessageSquare } from "react-icons/fi";

const items = [
  { title: "Overview", url: "/admin", icon: FiHome },
  { title: "Users", url: "/admin/users", icon: FiUsers },
  { title: "Verification", url: "/admin/verification", icon: FiCheckCircle },
  { title: "Content Moderation", url: "/admin/content-moderation", icon: FiMessageSquare },
  { title: "Analytics", url: "/admin/analytics", icon: FiBarChart2 },
  { title: "Success Stories", url: "/admin/success-stories", icon: FiHeart },
  { title: "Reports", url: "/admin/reports", icon: FiAlertTriangle },
  { title: "Settings", url: "/admin/settings", icon: FiSettings },
];

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
