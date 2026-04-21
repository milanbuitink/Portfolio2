import Header from "@/components/Header";
import ProjectList from "@/components/ProjectList";
import HeroLoader from "@/components/HeroLoader";
import { useCallback, useState } from "react";

const Index = () => {
  const [isLoaderComplete, setIsLoaderComplete] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setIsLoaderComplete(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {!isLoaderComplete && <HeroLoader onComplete={handleLoaderComplete} />}

      {isLoaderComplete && (
        <>
          <Header />
          <main>
            <ProjectList />
          </main>
        </>
      )}
    </div>
  );
};

export default Index;
