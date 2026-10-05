import { Outlet, Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-neutral-800 bg-black/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-lg sm:text-xl font-semibold">
              amplif.AI
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-2 lg:gap-4">
              <Link to="/">
                <Button 
                  variant={location.pathname === "/" ? "secondary" : "ghost"}
                  size="sm"
                >
                  Gallery
                </Button>
              </Link>
              <Link to="/services">
                <Button 
                  variant={location.pathname === "/services" ? "secondary" : "ghost"}
                  size="sm"
                >
                  Services
                </Button>
              </Link>
              <Link to="/blog">
                <Button 
                  variant={location.pathname.startsWith("/blog") ? "secondary" : "ghost"}
                  size="sm"
                >
                  Blog
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant={location.pathname === "/contact" ? "secondary" : "ghost"}
                  size="sm"
                >
                  Contact
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-400 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-neutral-800 pt-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={location.pathname === "/" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                >
                  Gallery
                </Button>
              </Link>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={location.pathname === "/services" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                >
                  Services
                </Button>
              </Link>
              <Link to="/blog" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={location.pathname.startsWith("/blog") ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                >
                  Blog
                </Button>
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  variant={location.pathname === "/contact" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                >
                  Contact
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      <Outlet />

      {/* Footer */}
      <footer className="border-t border-neutral-800 px-6 py-8 text-center">
        <p className="text-sm text-neutral-500">
          © {new Date().getFullYear()} B.B. Moldenhauer • All Rights Reserved
        </p>
      </footer>
    </div>
  );
}