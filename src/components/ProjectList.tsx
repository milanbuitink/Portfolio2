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
  const containerRef = useRef<HTMLDivElement>(null);

  const currentProject = projects[currentProjectIndex];
  const currentImage = currentProject?.images[currentImageIndex];

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // swipe left
    const isRightSwipe = distance < -50; // swipe right

    if (isLeftSwipe || isRightSwipe) {
      setIsTransitioning(true);
      
      if (isLeftSwipe) {
        // Next project
        if (currentProjectIndex < projects.length - 1) {
          setCurrentProjectIndex(currentProjectIndex + 1);
          setCurrentImageIndex(0);
        }
      } else if (isRightSwipe) {
        // Previous project
        if (currentProjectIndex > 0) {
          setCurrentProjectIndex(currentProjectIndex - 1);
          setCurrentImageIndex(0);
        }
      }

      setTimeout(() => setIsTransitioning(false), 300);
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
      <div
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden bg-black cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image container */}
        <div
          className="absolute inset-0 flex items-center justify-center"
        >
          {currentImage && (
            <img
              key={`${currentProjectIndex}-${currentImageIndex}`}
              src={currentImage.src}
              alt={currentImage.alt}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-500",
                isTransitioning ? "opacity-0" : "opacity-100"
              )}
            />
          )}
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
        </div>

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
            <div className="text-white/50 text-xs tracking-widest font-light animate-pulse">
              swipe ←
            </div>
          </div>
        )}

        {/* Navigation indicators */}
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center pointer-events-none">
          <div className={cn("text-xs text-white/40 transition-opacity", currentProjectIndex === 0 ? "opacity-40" : "opacity-100")}>
            ← prev
          </div>
          <div className={cn("text-xs text-white/40 transition-opacity", currentProjectIndex === projects.length - 1 ? "opacity-40" : "opacity-100")}>
            next →
          </div>
        </div>
      </div>
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
