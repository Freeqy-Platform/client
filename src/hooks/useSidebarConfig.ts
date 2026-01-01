import { useLocation } from "react-router-dom";
import { useMe } from "./user/userHooks";
import type { SidebarConfig } from "@/components/navigation/AppSidebar";
import {
  User,
  FolderKanban,
  Mail,
  PlusCircle,
  FolderOpen,
  Search,
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Shield,
  Sparkles,
} from "lucide-react";
import { MdOutlineInsertInvitation } from "react-icons/md";
import type { LucideIcon } from "lucide-react";

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
  const navigationLinks = [{ label: "Profile", path: "/profile", icon: User }];

  // Add Settings link if on profile pages
  if (location.pathname.startsWith("/profile")) {
    navigationLinks.push({
      label: "Settings",
      path: "/profile/settings",
      icon: Settings,
    });
  }

  // Add other navigation links
  navigationLinks.push(
    { label: "Projects", path: "/projects", icon: FolderKanban },
    { label: "Find Collaborators", path: "/users", icon: Users },
    { label: "Messages", path: "/messages", icon: Mail },
    {
      label: "Invitations",
      path: "/projects/invitations",
      icon: MdOutlineInsertInvitation as unknown as LucideIcon,
    }
  );

  return {
    navigationLinks,
    actionLinks: [
      {
        label: "AI Project Analyzer",
        path: "/projects/analyze",
        icon: Sparkles,
      },
      {
        label: "Start New Project",
        path: "/projects?create=true",
        icon: PlusCircle,
      },
      { label: "My Projects", path: "/projects/my", icon: FolderOpen },
      { label: "Browse Projects", path: "/projects/browse", icon: Search },
    ],
    navigationLabel: "Navigation",
    actionLabel: "Actions",
  };
};
