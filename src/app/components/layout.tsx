import { Outlet, Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Wordmark } from "./wordmark";

const navLinks = [
  { to: "/services", label: "Services", isActive: (path: string) => path === "/services" },
  { to: "/", label: "Gallery", isActive: (path: string) => path === "/" },
  { to: "/blog", label: "Blog", isActive: (path: string) => path.startsWith("/blog") },
  { to: "/contact", label: "Contact", isActive: (path: string) => path === "/contact" },
];

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-sun text-ink">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-ink bg-sun">
        <div className="flex items-center justify-between px-5 py-6 sm:px-12 sm:py-7">
          <Link to="/" className="label-caps" onClick={() => setMobileMenuOpen(false)}>
            Forth Studios
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`label-caps underline-offset-4 decoration-1 hover:underline ${
                  link.isActive(location.pathname) ? "underline" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="-m-2 p-2 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-ink md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block border-b border-ink px-5 py-4 font-wide text-3xl uppercase last:border-b-0 ${
                  link.isActive(location.pathname) ? "bg-ink text-sun" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-ink px-5 pt-12 pb-8 text-sun sm:px-12">
        <Wordmark text="FORTH" />
        <div className="mt-8 flex flex-col gap-3 border-t border-sun/40 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} B.B. Moldenhauer — All Rights Reserved</p>
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="label-caps text-sm hover:underline underline-offset-4">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
