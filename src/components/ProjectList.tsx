import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { projects, getHoverPosition } from "@/data/projects";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import gsap from "gsap";
import { Observer } from "gsap/all";

gsap.registerPlugin(Observer);

// ─── Mobile: GSAP Observer-driven fullscreen vertical swipe ───────────────
const MobileSwipePortfolio = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const currentIndex = useRef(0);
  const animating = useRef(false);
  const navigate = useNavigate();

  const addSection = useCallback((el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  }, []);

  useLayoutEffect(() => {
    const sections = sectionsRef.current;
    if (sections.length === 0) return;

    // Lock the viewport
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Initial state: all sections stacked, only first visible
    sections.forEach((section, i) => {
      const img = section.querySelector<HTMLElement>(".swipe-img");
      const title = section.querySelector<HTMLElement>(".swipe-title");

      gsap.set(section, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: i === 0 ? 1 : 0,
        visibility: i === 0 ? "visible" : "hidden",
        willChange: "transform",
      });

      if (i === 0) {
        // First section starts revealed
        gsap.set(img, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(title, { opacity: 1, y: 0 });
      } else {
        gsap.set(img, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(title, { opacity: 0, y: 40 });
      }
    });

    const goTo = (index: number) => {
      if (animating.current) return;
      if (index < 0 || index >= sections.length) return;
      if (index === currentIndex.current) return;
      animating.current = true;

      const leaving = sections[currentIndex.current];
      const entering = sections[index];
      const enterImg = entering.querySelector<HTMLElement>(".swipe-img");
      const enterTitle = entering.querySelector<HTMLElement>(".swipe-title");
      const leaveImg = leaving.querySelector<HTMLElement>(".swipe-img");
      const leaveTitle = leaving.querySelector<HTMLElement>(".swipe-title");
      const isDown = index > currentIndex.current;

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(leaving, { visibility: "hidden", zIndex: 0 });
          currentIndex.current = index;
          animating.current = false;
        },
      });

      // Bring entering section on top
      gsap.set(entering, { visibility: "visible", zIndex: 2 });
      gsap.set(leaving, { zIndex: 1 });

      // Phase 1: hide leaving title
      tl.to(leaveTitle, {
        opacity: 0,
        y: isDown ? -30 : 30,
        duration: 0.3,
        ease: "power2.in",
      });

      // Phase 2: mask out leaving image, mask in entering image
      tl.to(
        leaveImg,
        {
          clipPath: isDown ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)",
          duration: 0.7,
          ease: "power3.inOut",
        },
        "-=0.1"
      );
      tl.fromTo(
        enterImg,
        { clipPath: isDown ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.7,
          ease: "power3.inOut",
        },
        "<"
      );

      // Phase 3: Reveal entering title
      tl.fromTo(
        enterTitle,
        { opacity: 0, y: isDown ? 40 : -40 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      );
    };

    // GSAP Observer for touch swipe + mouse wheel
    const observer = Observer.create({
      type: "touch,wheel",
      target: wrapperRef.current!,
      wheelSpeed: -1,
      tolerance: 30,
      preventDefault: true,
      onUp: () => goTo(currentIndex.current + 1),
      onDown: () => goTo(currentIndex.current - 1),
    });

    return () => {
      observer?.kill();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      sectionsRef.current = [];
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 w-full h-[100dvh] bg-white overflow-hidden"
      style={{ touchAction: "none", overscrollBehavior: "none" }}
    >
      {/* Intro / entry screen (mobile only) */}
      <div ref={addSection} className="absolute inset-0">
        <div className="swipe-img absolute inset-0 bg-white" />

        <div className="swipe-title absolute inset-0 z-10 px-8 text-center pointer-events-none flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <h2
              className="text-sm font-light tracking-widest text-foreground"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              geselecteerde projecten {" "}
            </h2>

            <div className="flex items-center gap-2 text-muted-foreground motion-safe:animate-subtle-blink motion-reduce:animate-none">
              <span className="text-xs font-light tracking-widest">swipe</span>
              <span className="text-xs font-light tracking-widest">↑</span>
            </div>
          </div>
        </div>
      </div>

      {projects.map((project, i) => {
        const imageSrc = Array.isArray(project.images[0]?.src)
          ? project.images[0]?.src[0]
          : project.images[0]?.src;
        const thumbnailSrc = Array.isArray(project.thumbnail)
          ? project.thumbnail[0]
          : project.thumbnail;
        const displaySrc = imageSrc || thumbnailSrc || "";

        return (
        <div key={project.id} ref={addSection} className="absolute inset-0">
          {/* Image with clip-path mask for reveal animation */}
          <div
            className="swipe-img absolute inset-0 will-change-[clip-path]"
            onClick={() =>
              navigate(`/project/${project.slug}`, {
                state: { fromProjectList: true },
              })
            }
          >
            <img
              src={displaySrc}
              alt={project.title}
              loading={i < 2 ? "eager" : "lazy"}
              decoding="async"
              className="block w-full h-full object-contain"
              style={{ willChange: "transform" }}
            />
          </div>

          {/* Title overlay */}
          <div className="swipe-title absolute bottom-0 left-0 right-0 z-10 px-6 pb-24 pointer-events-none will-change-[transform,opacity]">
            <Link
              to={`/project/${project.slug}`}
              state={{ fromProjectList: true }}
              className="pointer-events-auto"
            >
              <h3
                className="text-3xl font-bold tracking-tight text-foreground"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {project.title}
              </h3>
              {(project.category || project.year) && (
                <p
                  className="mt-2 text-xs font-light tracking-widest text-muted-foreground"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {project.category ?? project.year}
                </p>
              )}
            </Link>
          </div>
        </div>
        );
      })}
    </div>
  );
};

// ─── Desktop: originele hover-titel lijst ─────────────────────────────────
const DesktopHoverList = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const getPreviewPosition = (projectId: string) => {
    const pos = getHoverPosition(projectId);
    return { left: pos.x, top: pos.y, imgWidth: pos.size };
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 md:px-8">
      {/* Hover preview afbeeldingen op vaste posities */}
      {projects.map((project) => {
        const pos = getPreviewPosition(project.id);
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
              width: pos.imgWidth,
              height: "auto",
              overflow: "visible",
            }}
          >
            <img
              src={project.thumbnail}
              alt={project.title}
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "none",
                maxHeight: "none",
                display: "block",
              }}
              className="object-cover"
            />
          </div>
        );
      })}

      {/* Titellijst */}
      <nav className="relative z-20 text-center py-32">
        <ul className="space-y-2 md:space-y-3">
          {projects.map((project, index) => {
            const opacity = 1 - (index / (projects.length - 1)) * 0.5;
            return (
              <li key={project.id}>
                <Link
                  to={`/project/${project.slug}`}
                  state={{ fromProjectList: true }}
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

// ─── Main Component ───────────────────────────────────────────────────────
const ProjectList = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileSwipePortfolio />;
  }

  return <DesktopHoverList />;
};

export default ProjectList;
