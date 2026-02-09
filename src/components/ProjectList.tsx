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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"up" | "down" | null>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent page scroll when dragging on mobile by using a non-passive listener
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    el.addEventListener("touchmove", onMove as EventListener, { passive: false });
    return () => el.removeEventListener("touchmove", onMove as EventListener);
  }, [isDragging]);

  const currentProject = projects[currentProjectIndex];
  const currentImage = currentProject?.images[currentImageIndex];

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const y = e.targetTouches[0].clientY;
    setTouchStart(y);
    setTouchEnd(y);
    setIsDragging(true);
    setDragY(0);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const y = e.changedTouches[0].clientY;
    setTouchEnd(y);
    setIsDragging(false);
    handleSwipe();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const y = e.touches[0].clientY;
    setTouchEnd(y);
    const delta = y - touchStart;
    // Limit drag a bit so it feels natural
    setDragY(delta);
  };

  const handleSwipe = () => {
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) < 50) {
      // not a swipe - reset
      setDragY(0);
      return;
    }

    const isSwipeUp = distance > 0; // upward movement = next
    const isSwipeDown = distance < 0; // downward = previous

    if (isSwipeUp && currentProjectIndex < projects.length - 1) {
      setIsTransitioning(true);
      setSwipeDirection("up");
      // animate then commit
      setTimeout(() => {
        setCurrentProjectIndex((i) => i + 1);
        setIsTransitioning(false);
        setSwipeDirection(null);
        setDragY(0);
      }, 220);
    } else if (isSwipeDown && currentProjectIndex > 0) {
      setIsTransitioning(true);
      setSwipeDirection("down");
      setTimeout(() => {
        setCurrentProjectIndex((i) => i - 1);
        setIsTransitioning(false);
        setSwipeDirection(null);
        setDragY(0);
      }, 220);
    } else {
      // out of bounds - snap back
      setDragY(0);
    }
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
    // determine potential neighbour while dragging
    const nextIndexWhileDragging = dragY < 0 ? currentProjectIndex + 1 : dragY > 0 ? currentProjectIndex - 1 : null;

    return (
      <Link
        to={`/project/${currentProject?.slug}`}
        className="block w-full h-screen"
        onClick={(e) => {
          // prevent accidental navigation when user was dragging
          if (Math.abs(dragY) > 10) e.preventDefault();
        }}
      >
        <div
          ref={containerRef}
          className="relative w-full h-screen overflow-hidden bg-black cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Current image (drags with finger) - keep 10% side padding */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: isTransitioning
                ? swipeDirection === "up"
                  ? "translateY(-100vh)"
                  : "translateY(100vh)"
                : `translateY(${dragY}px)`,
              transition: isDragging ? "none" : "transform 220ms cubic-bezier(.22,.9,.3,1)",
            }}
          >
            <div className="w-full h-full px-[10vw] flex items-center justify-center">
              {currentImage && (
                <img
                  key={`curr-${currentProjectIndex}-${currentImageIndex}`}
                  src={currentImage.src}
                  alt={currentImage.alt}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  className="max-w-full"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
          </div>

          {/* Neighbour image that stays attached like a roll */}
          {((dragY < 0 && currentProjectIndex < projects.length - 1) || (dragY > 0 && currentProjectIndex > 0) || isTransitioning) && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: isTransitioning
                  ? "translateY(0)"
                  : dragY < 0
                  ? `translateY(calc(100vh + ${dragY}px))`
                  : `translateY(calc(-100vh + ${dragY}px))`,
                transition: isDragging ? "none" : "transform 220ms cubic-bezier(.22,.9,.3,1)",
              }}
            >
              <div className="w-full h-full px-[10vw] flex items-center justify-center">
                <img
                  key={`next-${currentProjectIndex}`}
                  src={
                    // during transition use swipeDirection to pick next, otherwise use drag direction
                    isTransitioning
                      ? projects[
                          swipeDirection === "up"
                            ? Math.min(currentProjectIndex + 1, projects.length - 1)
                            : Math.max(currentProjectIndex - 1, 0)
                        ]?.images[0]?.src
                      : projects[nextIndexWhileDragging ?? currentProjectIndex]?.images[0]?.src
                  }
                  alt="next"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  className="max-w-full"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
            </div>
          )}

          {/* Title overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <h1
              className={cn(
                "text-center text-white text-4xl sm:text-5xl font-bold tracking-tight px-6 drop-shadow-2xl transition-all duration-500",
                isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              )}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                lineHeight: "1.2",
              }}
            >
              {currentProject?.title}
            </h1>
          </div>

          {/* Project counter */}
          <div className="absolute bottom-8 left-0 right-0 z-20 text-center">
            <p className="text-white text-sm font-light tracking-widest">
              {currentProjectIndex + 1} / {projects.length}
            </p>
          </div>

          {/* Swipe hint (first project only) */}
          {currentProjectIndex === 0 && (
            <div className="absolute top-1/2 right-6 z-20 transform -translate-y-1/2">
              <div className="text-white/50 text-xs tracking-widest font-light animate-pulse pointer-events-none">
                swipe ↑
              </div>
            </div>
          )}

          {/* Navigation indicators */}
          <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center pointer-events-none">
            <div className={cn("text-xs text-white/40 transition-opacity", currentProjectIndex === 0 ? "opacity-40" : "opacity-100")}>
              ↑ prev
            </div>
            <div className={cn("text-xs text-white/40 transition-opacity", currentProjectIndex === projects.length - 1 ? "opacity-40" : "opacity-100")}>
              next ↓
            </div>
          </div>

          {/* Tap to navigate hint */}
          <div className="absolute bottom-20 left-0 right-0 z-20 text-center pointer-events-none">
            <p className="text-white/40 text-xs tracking-widest font-light">
              tap to view
            </p>
          </div>
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
