import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

export interface SidebarLink {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface SidebarConfig {
  navigationLinks: SidebarLink[];
  actionLinks?: SidebarLink[];
  navigationLabel?: string;
  actionLabel?: string;
}

interface AppSidebarProps {
  config: SidebarConfig;
}

const AppSidebar = ({ config }: AppSidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    // For exact matches like /dashboard or /profile
    if (path === "/dashboard" || path === "/profile") {
      return location.pathname === path;
    }
    // For paths that can have sub-routes
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="top-16">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="hidden md:opacity-100 md:block lg:block">
            {config.navigationLabel || "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {config.navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <SidebarMenuItem key={link.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(link.path)}
                      tooltip={link.label}
                      className={cn(
                        isActive(link.path) &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      <Link to={link.path}>
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="hidden md:opacity-100 md:inline lg:inline">
                          {link.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {config.actionLinks && config.actionLinks.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="hidden md:opacity-100 md:block lg:block">
              {config.actionLabel || "Actions"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {config.actionLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <SidebarMenuItem key={link.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(link.path)}
                        tooltip={link.label}
                        className={cn(
                          isActive(link.path) &&
                            "bg-accent text-accent-foreground"
                        )}
                      >
                        <Link to={link.path}>
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="hidden md:opacity-100 md:inline lg:inline">
                            {link.label}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
