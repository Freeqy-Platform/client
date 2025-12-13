import { Link } from "react-router-dom";
import { Users } from "lucide-react";

const Footer = () => {
  const platformLinks = [
    { label: "How it Works", path: "#how-it-works" },
    { label: "Browse Projects", path: "/projects" },
    { label: "Find Teams", path: "/teams" },
    { label: "Pricing", path: "/pricing" },
  ];

  const companyLinks = [
    { label: "About Us", path: "/about" },
    { label: "Careers", path: "/careers" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ];

  const supportLinks = [
    { label: "Help Center", path: "/help" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Community", path: "/community" },
  ];

  return (
    <footer className="bg-[#1e293b] text-white">
      <div className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Branding Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--purple)] text-[var(--purple-foreground)]">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">Freeqy</span>
            </Link>
            <p className="text-sm leading-relaxed text-white/70">
              Building the future of team collaboration, one project at a time.
            </p>
          </div>

          {/* Platform Links Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Platform</h3>
            <ul className="flex flex-col gap-3">
              {platformLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Company</h3>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Support</h3>
            <ul className="flex flex-col gap-3">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/60">
            © 2024 Freeqy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
