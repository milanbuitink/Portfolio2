import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Header (scrolls with page) */}
      <header className="relative z-50 p-6 md:p-8">
        <div className="flex items-start justify-between">
          {/* Menu Button - Links boven */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-foreground hover:opacity-60 transition-opacity duration-300"
            aria-label={isMenuOpen ? "Sluit menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" strokeWidth={1.5} />
            ) : (
              <Plus className="w-6 h-6" strokeWidth={1.5} />
            )}
          </button>

          {/* Naam - Gecentreerd */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 text-sm md:text-base font-bold tracking-widest uppercase hover:opacity-60 transition-opacity duration-300"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {siteConfig.name}
          </Link>

          {/* Placeholder voor balans */}
          <div className="w-6 h-6" />
        </div>
      </header>

      {/* Fullscreen Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background transition-all duration-500 ease-out flex items-center justify-center",
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="text-center space-y-8">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block text-4xl md:text-6xl font-light tracking-wide hover:opacity-60 transition-opacity duration-300"
          >
            Work
          </Link>
          <Link
            to="/archive"
            onClick={() => setIsMenuOpen(false)}
            className="block text-4xl md:text-6xl font-light tracking-wide hover:opacity-60 transition-opacity duration-300"
          >
            Archive
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMenuOpen(false)}
            className="block text-4xl md:text-6xl font-light tracking-wide hover:opacity-60 transition-opacity duration-300"
          >
            About
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Header;
