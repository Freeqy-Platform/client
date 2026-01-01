import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, User, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useMe } from "@/hooks/user/userHooks";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSidebarConfig } from "@/hooks/useSidebarConfig";

const AppHeader = () => {
  const { logout } = useAuth();
  const { data: user } = useMe();
  const location = useLocation();
  const sidebarConfig = useSidebarConfig();
  const hasSidebar = sidebarConfig !== null;

  // Navigation links for app pages
  const appNavLinks = [
    { label: "Projects", path: "/projects" },
    { label: "Messages", path: "/messages" },
    { label: "Invitations", path: "/projects/invitations" },
    { label: "Home", path: "/" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Sidebar Toggle - Only show when sidebar exists */}
          <div className="flex items-center gap-2">
            {hasSidebar && <SidebarTrigger />}
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--purple)] text-[var(--purple-foreground)]">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-foreground">Freeqy</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-6 md:flex">
            {appNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[var(--purple)]",
                  isActive(link.path) && "text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      {user.photoUrl && (
                        <AvatarImage
                          className="object-cover"
                          src={user.photoUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                      )}
                      <AvatarFallback className="bg-[var(--purple)] text-[var(--purple-foreground)] text-sm font-semibold">
                        {`${user.firstName?.[0] ?? ""}${
                          user.lastName?.[0] ?? ""
                        }`.trim() ||
                          user.userName?.slice(0, 2).toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
