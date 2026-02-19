import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const ProjectList = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Mobile swipe state
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchDeltaYRef = useRef(0);
  const timeoutRef = useRef<number[]>([]);
  const isMountedRef = useRef(true);

  // Prevent page scroll/pull-to-refresh on mobile list view
  useEffect(() => {
    if (!isMobile) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyOverscroll = document.body.style.overscrollBehavior;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    const el = containerRef.current;
    if (!el) {
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.overscrollBehavior = originalBodyOverscroll;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
      };
    }

    const onMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    el.addEventListener("touchmove", onMove as EventListener, { passive: false });
    return () => {
      el.removeEventListener("touchmove", onMove as EventListener);
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.overscrollBehavior = originalBodyOverscroll;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
    };
  }, [isMobile]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      timeoutRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  const currentProject = projects[currentProjectIndex];

  const preloadImage = (src?: string) =>
    new Promise<void>((resolve) => {
      if (!src) {
        resolve();
        return;
      }

      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = src;

      if (image.complete) {
        resolve();
      }
    });

  const runProjectTransition = (nextIndex: number) => {
    if (nextIndex === currentProjectIndex || isTransitioning) return;

    setIsTransitioning(true);
    setOverlayOpacity(1);

    const swapTimeout = window.setTimeout(() => {
      const nextImageSrc = projects[nextIndex]?.images[0]?.src;

      void preloadImage(nextImageSrc).then(() => {
        if (!isMountedRef.current) return;
        setCurrentProjectIndex(nextIndex);
        window.requestAnimationFrame(() => {
          if (!isMountedRef.current) return;
          setOverlayOpacity(0);
        });
      });
    }, 750);

    const finishTimeout = window.setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);

    timeoutRef.current.push(swapTimeout, finishTimeout);
  };

  // Touch handlers (1 swipe = trigger transition)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    touchStartYRef.current = e.targetTouches[0].clientY;
    touchDeltaYRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isTransitioning || touchStartYRef.current === null) return;
    const currentY = e.targetTouches[0].clientY;
    touchDeltaYRef.current = currentY - touchStartYRef.current;
  };

  const handleTouchEnd = () => {
    if (isTransitioning || touchStartYRef.current === null) return;

    const deltaY = touchDeltaYRef.current;
    const threshold = 50;

    if (deltaY < -threshold && currentProjectIndex < projects.length - 1) {
      runProjectTransition(currentProjectIndex + 1);
    } else if (deltaY > threshold && currentProjectIndex > 0) {
      runProjectTransition(currentProjectIndex - 1);
    }

    touchStartYRef.current = null;
    touchDeltaYRef.current = 0;
  };

  const getPreviewPosition = (index: number) => {
    // wissel tussen vaste posities per index (aanpasbaar)
    const positions = [
      { left: "40%", top: "40%", imgWidth: "100%" },
      { left: "60%", top: "50%", imgWidth: "29vw" },
      { left: "50%", top: "45%", imgWidth: "45vw" },
      { left: "50%", top: "45%", imgWidth: "45vw" },
      { left: "10%", top: "45%", imgWidth: "45vw" },
    ];
    return positions[index % positions.length];
  };

  // Mobile view
  if (isMobile) {
    return (
      <Link
        to={`/project/${currentProject?.slug}`}
        className="block w-full h-[100dvh]"
        onClick={(e) => {
          if (isTransitioning || touchStartYRef.current !== null) e.preventDefault();
        }}
      >
        <div
          ref={containerRef}
          className="relative w-full h-[100dvh] overflow-hidden bg-white flex flex-col touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ overscrollBehavior: "none" }}
        >
          {/* Project content blijft op exact dezelfde plek */}
          <div
            className="absolute inset-0"
            style={{
              opacity: 1,
              transition: "none",
            }}
          >
            <div className="absolute bottom-[39%] left-0 right-0 flex justify-center px-4 w-full">
              <div className="overflow-hidden w-full max-w-sm aspect-video flex items-center justify-center bg-white">
                {currentProject?.images[0] && (
                  <img
                    src={currentProject.images[0].src}
                    alt={currentProject.title}
                    className="block w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <div className="absolute top-[71%] left-0 right-0 flex justify-center w-full -translate-y-1/2">
              <h3
                className="text-2xl font-bold tracking-tight text-black text-center"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {currentProject?.title}
              </h3>
            </div>
          </div>

          {/* Fade overlay: 0.75s uit naar wit + 0.75s in */}
          <div
            className="absolute inset-0 z-20 bg-white pointer-events-none"
            style={{
              opacity: overlayOpacity,
              transition: "opacity 750ms ease",
            }}
          />

          {/* Swipe hint - alleen op eerste pagina */}
          {currentProjectIndex === 0 && (
            <div className="absolute bottom-20 right-6 z-20">
              <div className="text-black/50 text-xs tracking-widest font-light pointer-events-none">
                swipe ↑
              </div>
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Desktop view (existing hover functionality)
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 md:px-8">
      {/* Project hover images (fixed positions per title) */}
      {projects.map((project, index) => {
        const pos = getPreviewPosition(index);
        return (
          <div
            key={`image-${project.id}`}
            className={cn(
              "fixed pointer-events-none z-0 transition-opacity duration-300 ease-out",
              hoveredProject === project.id ? "opacity-100" : "opacity-0"
            )}
            style={{
              left: pos.left,
              top: pos.top,
              transform: "translate(-50%, -50%)",
            }}
          >
            <img
              src={project.thumbnail}
              alt={project.title}
              style={{ width: pos.imgWidth }}
              className="h-auto object-cover"
            />
          </div>
        );
      })}

      {/* Project lijst */}
      <nav className="relative z-20 text-center py-32">
        <ul className="space-y-2 md:space-y-3">
          {projects.map((project, index) => {
            // Bereken opacity voor gradatie effect (donker naar licht)
            const opacity = 1 - (index / (projects.length - 1)) * 0.5;

            return (
              <li key={project.id}>
                <Link
                  to={`/project/${project.slug}`}
                  className="block group"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <span
                    className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight transition-all duration-300 group-hover:tracking-wider"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      opacity: hoveredProject
                        ? hoveredProject === project.id
                          ? 1
                          : 0.2
                        : opacity,
                    }}
                  >
                    {project.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default ProjectList;
