import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { label: "How it Works", path: "#how-it-works" },
    { label: "Browse Projects", path: "/projects" },
    { label: "Find Teams", path: "/teams" },
    { label: "About", path: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--purple)] text-[var(--purple-foreground)]">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">Freeqy</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-foreground transition-colors hover:text-[var(--purple)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
