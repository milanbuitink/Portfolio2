import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const ProjectList = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Mobile swipe state - simplified
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef(0);

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
  const nextProjectIndex = Math.min(currentProjectIndex + 1, projects.length - 1);
  const prevProjectIndex = Math.max(currentProjectIndex - 1, 0);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSnapping) return;
    touchStartRef.current = e.targetTouches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isSnapping) return;
    const currentY = e.touches[0].clientY;
    const delta = currentY - touchStartRef.current;
    // Apply drag resistance
    setDragY(delta * 0.8);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 80; // swipe distance to trigger snap

    if (dragY < -threshold && currentProjectIndex < projects.length - 1) {
      // Swipe up - go to next project
      setIsSnapping(true);
      setDragY(-window.innerHeight);
      setTimeout(() => {
        setCurrentProjectIndex((i) => i + 1);
        setDragY(0);
        setIsSnapping(false);
      }, 300);
    } else if (dragY > threshold && currentProjectIndex > 0) {
      // Swipe down - go to previous project
      setIsSnapping(true);
      setDragY(window.innerHeight);
      setTimeout(() => {
        setCurrentProjectIndex((i) => i - 1);
        setDragY(0);
        setIsSnapping(false);
      }, 300);
    } else {
      // Not enough distance - snap back
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
    return (
      <Link
        to={`/project/${currentProject?.slug}`}
        className="block w-full h-screen"
        onClick={(e) => {
          // prevent navigation if user was dragging
          if (Math.abs(dragY) > 10) e.preventDefault();
        }}
      >
        <div
          ref={containerRef}
          className="relative w-full h-screen overflow-hidden bg-white flex flex-col"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Current project - follows finger during drag */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              transform: `translateY(${dragY}px)`,
              transition: isSnapping ? "transform 300ms cubic-bezier(0.22, 0.9, 0.3, 1)" : "none",
            }}
          >
            {/* Image box - centered */}
            <div className="flex-1 flex items-center justify-center px-8 w-full">
              <div className="overflow-hidden w-full max-w-sm aspect-video flex items-center justify-center bg-white">
                {currentProject?.images[0] && (
                  <img
                    src={currentProject.images[0].src}
                    alt={currentProject.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Title label below image */}
            <div className="py-2 text-center -mt-24">
              <h3
                className="text-2xl font-bold tracking-tight text-black"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                {currentProject?.title}
              </h3>
            </div>
          </div>

          {/* Next/Prev project preview - appears from bottom/top */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              transform: `translateY(calc(100vh + ${dragY}px))`,
              transition: isSnapping ? "transform 300ms cubic-bezier(0.22, 0.9, 0.3, 1)" : "none",
            }}
          >
            {/* Image box - centered */}
            <div className="flex-1 flex items-center justify-center px-8 w-full">
              <div className="overflow-hidden w-full max-w-sm aspect-video flex items-center justify-center bg-white">
                {dragY < 0 && currentProjectIndex < projects.length - 1 && projects[nextProjectIndex]?.images[0] && (
                  <img
                    src={projects[nextProjectIndex].images[0].src}
                    alt={projects[nextProjectIndex].title}
                    className="w-full h-full object-cover"
                  />
                )}
                {dragY > 0 && currentProjectIndex > 0 && projects[prevProjectIndex]?.images[0] && (
                  <img
                    src={projects[prevProjectIndex].images[0].src}
                    alt={projects[prevProjectIndex].title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Title label below image */}
            <div className="py-2 text-center -mt-24">
              <h3
                className="text-2xl font-bold tracking-tight text-black"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                {dragY < 0 && currentProjectIndex < projects.length - 1
                  ? projects[nextProjectIndex]?.title
                  : dragY > 0 && currentProjectIndex > 0
                  ? projects[prevProjectIndex]?.title
                  : ""}
              </h3>
            </div>
          </div>

          {/* Swipe hint - bottom right, first page only */}
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
