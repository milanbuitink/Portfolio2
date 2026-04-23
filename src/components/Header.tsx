import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";

type HeaderProps = {
  menuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
};

const Header = ({ menuOpen, onMenuOpenChange }: HeaderProps) => {
  const isControlled = menuOpen !== undefined;
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isMenuOpen = useMemo(
    () => (isControlled ? (menuOpen as boolean) : internalMenuOpen),
    [isControlled, menuOpen, internalMenuOpen]
  );

  // Requirement: no top-left close (X) on the homepage.
  // On home we only show the menu button when the menu is closed.
  const showMenuButton = !isHome || !isMenuOpen;

  const setMenuOpen = (next: boolean) => {
    if (!isControlled) setInternalMenuOpen(next);
    onMenuOpenChange?.(next);
  };

  const [menuAnimReady, setMenuAnimReady] = useState(false);

  useEffect(() => {
    setMenuAnimReady(true);
  }, []);

  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    if (isMenuOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = "hidden";
      body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : prevPaddingRight;
    } else {
      body.style.overflow = "unset";
      body.style.paddingRight = prevPaddingRight;
    }

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Header (scrolls with page) */}
      <header className="relative z-50 p-6 md:p-8">
        <div className="flex items-start justify-between">
          {/* Menu Button - Links boven */}
          {showMenuButton ? (
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="text-foreground hover:opacity-60 transition-opacity duration-300"
              aria-label={isMenuOpen ? "Sluit menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" strokeWidth={1.5} />
              ) : (
                <Plus className="w-6 h-6" strokeWidth={1.5} />
              )}
            </button>
          ) : (
            <div className="w-6 h-6" aria-hidden="true" />
          )}

          {/* Naam - Gecentreerd */}
          <Link
            to="/"
            data-site-title
            className="absolute left-1/2 -translate-x-1/2 inline-block w-max max-w-none whitespace-nowrap leading-none text-[0.6rem] sm:text-[0.68rem] md:text-base font-bold tracking-[0.09em] sm:tracking-[0.11em] md:tracking-widest uppercase hover:opacity-60 transition-opacity duration-300"
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
          "fixed inset-0 z-40 bg-background flex items-center justify-center transform-gpu transition-[opacity,transform] duration-700 ease-out",
          isMenuOpen && menuAnimReady
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <nav
          className="text-center space-y-6 md:space-y-4"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-xs md:text-sm font-semibold tracking-widest uppercase hover:opacity-60 transition-opacity duration-300"
          >
            Work
          </Link>
          <Link
            to="/archive"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-xs md:text-sm font-semibold tracking-widest uppercase hover:opacity-60 transition-opacity duration-300"
          >
            Archive
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-xs md:text-sm font-semibold tracking-widest uppercase hover:opacity-60 transition-opacity duration-300"
          >
            About
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Header;
