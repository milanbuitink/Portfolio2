import Header from "@/components/Header";
import HeroLoader from "@/components/HeroLoader";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

let hasPlayedHomeLoader = false;

const Index = () => {
  const location = useLocation();
  const shouldRunLoader = !hasPlayedHomeLoader;
  const [isContentRevealed, setIsContentRevealed] = useState(!shouldRunLoader);
  const [isLoaderComplete, setIsLoaderComplete] = useState(!shouldRunLoader);

  useEffect(() => {
    return () => {
      document.body.classList.remove("hide-scrollbar");
      document.documentElement.classList.remove("hide-scrollbar");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    // While the loader runs, hard-lock scrolling to avoid any scrollbar
    // appearing/disappearing (which causes a layout shift on first load).
    if (!isLoaderComplete) {
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
      body.classList.remove("hide-scrollbar");
      html.classList.remove("hide-scrollbar");
      return;
    }

    body.classList.remove("hide-scrollbar");
    html.classList.remove("hide-scrollbar");
  }, [isLoaderComplete]);

  const handleLoaderReveal = useCallback(() => {
    setIsContentRevealed(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    hasPlayedHomeLoader = true;
    setIsLoaderComplete(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {!isLoaderComplete && (
        <HeroLoader onReveal={handleLoaderReveal} onComplete={handleLoaderComplete} />
      )}

      <div
        className={
          isContentRevealed
            ? "opacity-100 transition-opacity duration-500 ease-out"
            : "opacity-0 pointer-events-none transition-opacity duration-500 ease-out"
        }
        aria-hidden={!isContentRevealed}
      >
        <Header />

        {isLoaderComplete && (
          <main className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-6 md:px-8 pb-16 md:pb-20">
            <nav className="w-full max-w-3xl text-center space-y-6 md:space-y-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <Link
                to="/project"
                className="block px-3 py-2 text-xs md:text-sm font-semibold tracking-widest uppercase hover:opacity-60 transition-opacity duration-300"
              >
                Work
              </Link>
              <Link
                to="/archive"
                className="block px-3 py-2 text-xs md:text-sm font-semibold tracking-widest uppercase hover:opacity-60 transition-opacity duration-300"
              >
                Archive
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-xs md:text-sm font-semibold tracking-widest uppercase hover:opacity-60 transition-opacity duration-300"
              >
                About
              </Link>
            </nav>
          </main>
        )}
      </div>
    </div>
  );
};

export default Index;
