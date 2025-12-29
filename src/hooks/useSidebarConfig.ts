import { useLocation } from "react-router-dom";
import { useMe } from "./user/userHooks";
import type { SidebarConfig } from "@/components/navigation/AppSidebar";
import {
  User,
  FolderKanban,
  MessageSquare,
  Mail,
  PlusCircle,
  FolderOpen,
  Search,
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Shield,
} from "lucide-react";

export const useSidebarConfig = (): SidebarConfig | null => {
  const location = useLocation();
  const { data: user } = useMe();

  // Dashboard sidebar config (admin only)
  if (location.pathname.startsWith("/dashboard")) {
    if (user?.role !== "admin") {
      return null;
    }

    return {
      navigationLinks: [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "User Management",
          path: "/dashboard/users",
          icon: Users,
        },
        {
          label: "Website Configuration",
          path: "/dashboard/config",
          icon: Settings,
        },
        {
          label: "Projects",
          path: "/dashboard/projects",
          icon: FolderKanban,
        },
        {
          label: "Blog",
          path: "/dashboard/blog",
          icon: FileText,
        },
        {
          label: "Roles & Permissions",
          path: "/dashboard/roles",
          icon: Shield,
        },
      ],
      navigationLabel: "Admin Panel",
    };
  }

  // Regular app sidebar config (for profile, projects, messages, etc.)
  return {
    navigationLinks: [
      { label: "Profile", path: "/profile", icon: User },
      { label: "Projects", path: "/projects", icon: FolderKanban },
      { label: "Messages", path: "/messages", icon: MessageSquare },
      { label: "Invitations", path: "/projects/invitations", icon: Mail },
    ],
    actionLinks: [
      { label: "Start New Project", path: "/projects/new", icon: PlusCircle },
      { label: "My Projects", path: "/projects/my", icon: FolderOpen },
      { label: "Browse Projects", path: "/projects/browse", icon: Search },
    ],
    navigationLabel: "Navigation",
    actionLabel: "Actions",
  };
};

