import Header from "@/components/Header";
import ProjectList from "@/components/ProjectList";
import HeroLoader from "@/components/HeroLoader";
import { useCallback, useState } from "react";

const Index = () => {
  const [isContentRevealed, setIsContentRevealed] = useState(false);
  const [isLoaderComplete, setIsLoaderComplete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [canShowProjects, setCanShowProjects] = useState(false);

  const handleLoaderReveal = useCallback(() => {
    setIsContentRevealed(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setIsLoaderComplete(true);
    setMenuOpen(true);
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
