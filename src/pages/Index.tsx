import Header from "@/components/Header";
import ProjectList from "@/components/ProjectList";
import HeroLoader from "@/components/HeroLoader";
import { useCallback, useEffect, useState } from "react";

const Index = () => {
  const [isContentRevealed, setIsContentRevealed] = useState(false);
  const [isLoaderComplete, setIsLoaderComplete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [canShowProjects, setCanShowProjects] = useState(false);

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

    // On the project title list (Work) we still want scrolling,
    // but without a visible scrollbar.
    if (canShowProjects && !menuOpen) {
      body.style.overflow = "unset";
      html.style.overflow = "unset";
      body.classList.add("hide-scrollbar");
      html.classList.add("hide-scrollbar");
      return;
    }

    body.classList.remove("hide-scrollbar");
    html.classList.remove("hide-scrollbar");
  }, [isLoaderComplete, canShowProjects, menuOpen]);

  const handleLoaderReveal = useCallback(() => {
    setIsContentRevealed(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setIsLoaderComplete(true);
  }, []);

  const handleMenuOpenChange = useCallback((open: boolean) => {
    setMenuOpen(open);
    if (!open) setCanShowProjects(true);
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
        <Header menuOpen={menuOpen} onMenuOpenChange={handleMenuOpenChange} />

        {isLoaderComplete && canShowProjects && !menuOpen && (
          <main>
            <ProjectList />
          </main>
        )}
      </div>
    </div>
  );
};

export default Index;
