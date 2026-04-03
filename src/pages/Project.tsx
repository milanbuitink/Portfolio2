import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { getProjectBySlug, getAdjacentProjects } from "@/data/projects";
import Header from "@/components/Header";
import OptimizedImage from "@/components/OptimizedImage";
import ImageCarousel from "@/components/ImageCarousel";
import { getBlurPlaceholder } from "@/lib/blur-utils";
import { useEffect, useRef, useState } from "react";

const Project = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const { prev, next } = slug ? getAdjacentProjects(slug) : { prev: null, next: null };
  const [zoomImage, setZoomImage] = useState<{ src: string | string[]; alt: string; } | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const zoomViewportRef = useRef<HTMLDivElement | null>(null);
  const zoomImageRef = useRef<HTMLImageElement | null>(null);
  const panStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  const isDesktopViewport = () => window.matchMedia("(min-width: 768px)").matches;

  const openZoom = (src: string | string[], alt: string) => {
    if (!isDesktopViewport()) return;
    setZoomImage({ src, alt });
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const closeZoom = () => {
    setZoomImage(null);
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    setIsPanning(false);
  };

  const clampPan = (x: number, y: number, scale: number) => {
    const viewport = zoomViewportRef.current;
    const image = zoomImageRef.current;
    if (!viewport || !image || !image.naturalWidth || !image.naturalHeight) {
      return { x, y };
    }

    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;

    const fitScale = Math.min(
      viewportWidth / image.naturalWidth,
      viewportHeight / image.naturalHeight,
    );

    const renderedWidth = image.naturalWidth * fitScale * scale;
    const renderedHeight = image.naturalHeight * fitScale * scale;

    const maxX = Math.max(0, (renderedWidth - viewportWidth) / 2);
    const maxY = Math.max(0, (renderedHeight - viewportHeight) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  };

  const handleZoomWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY;
    setZoomScale((currentScale) => {
      const nextScale = Math.min(Math.max(delta < 0 ? currentScale + 0.12 : currentScale - 0.12, 1), 4);
      setPanOffset((currentPan) => clampPan(currentPan.x, currentPan.y, nextScale));
      return nextScale;
    });
  };

  const handlePanStart = (event: React.MouseEvent<HTMLDivElement>) => {
    if (zoomScale <= 1) return;
    setIsPanning(true);
    panStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: panOffset.x,
      offsetY: panOffset.y,
    };
  };

  const handlePanMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    event.preventDefault();

    const deltaX = event.clientX - panStartRef.current.x;
    const deltaY = event.clientY - panStartRef.current.y;
    const nextX = panStartRef.current.offsetX + deltaX;
    const nextY = panStartRef.current.offsetY + deltaY;

    setPanOffset(clampPan(nextX, nextY, zoomScale));
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  useEffect(() => {
    // Scroll naar top bij pagina wissel
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!zoomImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeZoom();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomImage]);

  useEffect(() => {
    if (!zoomImage) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [zoomImage]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">Project niet gevonden</h1>
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Terug naar home
          </Link>
        </div>
      </div>
    );
  }

  const heroImage = project.images[0];
  const heroSrc = heroImage
    ? (Array.isArray(heroImage.src) ? (heroImage.src[0] ?? project.thumbnail) : heroImage.src)
    : project.thumbnail;
  const heroZoomable = Boolean(heroImage && heroImage.zoomable && !Array.isArray(heroImage.src));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-32">
        {/* Hero Image */}
        <section className="w-full px-4 md:px-8 lg:px-16 mb-12 md:mb-16">
          <div
            className={`project-image-frame relative aspect-[16/9] md:aspect-[21/9] overflow-hidden ${heroZoomable ? "cursor-pointer" : ""}`}
            onClick={
              heroZoomable
                ? () => openZoom(heroSrc, project.title)
                : undefined
            }
          >
            <OptimizedImage
              src={heroSrc}
              alt={project.title}
              className="project-image-quality w-full h-full object-cover"
              containerClassName="absolute inset-0"
              blurDataURL={getBlurPlaceholder(heroSrc)}
              priority={true}
            />
          </div>
        </section>

        {/* Project Info */}
        <section className="max-w-4xl mx-auto px-6 md:px-8 mb-16 md:mb-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {project.title}
              </h1>
            </div>
            <div className="md:pt-4">
              <div className="space-y-2 text-lg md:text-xl font-light leading-relaxed text-muted-foreground">
                <p>Jaar: {project.info.jaar || "—"}</p>
                <p>Programma: {project.info.programma || "—"}</p>
                <p>Locatie: {project.info.locatie || "—"}</p>
                <p>Course: {project.info.course || "—"}</p>
                <p>Studietijd: {project.info.studietijd || "—"}</p>
                <p>Cijfer: {project.info.cijfer || "—"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Project Subtext */}
        {project.subtext && project.subtext.length > 0 ? (
          <section className="px-6 md:px-8 mb-16 md:mb-24">
            <div className="w-full md:w-1/2 mx-auto">
              <div className="space-y-6">
                {project.subtext.map((paragraph, paragraphIndex) => (
                  <p
                    key={paragraphIndex}
                    className="text-lg md:text-xl font-light leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Image Gallery */}
        <section className="px-4 md:px-8 lg:px-16 space-y-4 md:space-y-8">
          {project.images.slice(1).map((image, index) => {
            const isZoomable = Boolean(image.zoomable && !Array.isArray(image.src));
            const isCarousel = Array.isArray(image.src);
            const frameClassName = `project-image-frame relative w-full ${isCarousel ? "" : "overflow-hidden"} ${isZoomable ? "cursor-pointer" : ""}`.trim();
            const outerClassName = image.width === "half" ? "w-full md:w-1/2 md:mx-auto" : "w-full";

            return (
              <div key={index} className={outerClassName}>
                <div
                  className={frameClassName}
                  onClick={isZoomable ? () => openZoom(image.src as string, image.alt) : undefined}
                >
                  {Array.isArray(image.src) ? (
                    <ImageCarousel
                      images={image.src.map((src, slideIndex) => ({
                        src,
                        alt: image.alt,
                        caption: image.captions?.[slideIndex] ?? image.caption,
                      }))}
                    />
                  ) : (
                    <OptimizedImage
                      src={image.src}
                      alt={image.alt}
                      className="project-image-quality w-full h-auto object-cover"
                      blurDataURL={getBlurPlaceholder(image.src)}
                    />
                  )}
                </div>

                {image.caption && !Array.isArray(image.src) ? (
                  <p className="mt-4 text-lg md:text-xl font-light leading-relaxed text-muted-foreground">
                    {image.caption}
                  </p>
                ) : null}
              </div>
            );
          })}
        </section>

        {/* Navigation */}
        <section className="max-w-6xl mx-auto px-6 md:px-8 mt-16 md:mt-24">
          <div className="flex justify-between items-center border-t border-border pt-8">
            {prev ? (
              <button
                onClick={() => navigate(`/project/${prev.slug}`)}
                className="group flex items-center gap-3 hover:opacity-60 transition-opacity duration-300"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                <div className="text-left">
                  <span className="text-xs text-muted-foreground block mb-1">
                    Vorig project
                  </span>
                  <span
                    className="text-lg font-medium"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {prev.title}
                  </span>
                </div>
              </button>
            ) : (
              <div />
            )}

            {next ? (
              <button
                onClick={() => navigate(`/project/${next.slug}`)}
                className="group flex items-center gap-3 hover:opacity-60 transition-opacity duration-300 text-right"
              >
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">
                    Volgend project
                  </span>
                  <span
                    className="text-lg font-medium"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {next.title}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
              </button>
            ) : (
              <div />
            )}
          </div>
        </section>
      </main>

      {/* Desktop image zoom modal */}
      {zoomImage && (
        <div className="fixed inset-0 z-[120] hidden md:flex items-center justify-center bg-black/70 p-6" onClick={closeZoom}>
          <div
            className="relative w-full max-w-[1200px] h-[85vh] bg-transparent overflow-visible"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                closeZoom();
              }}
              className="absolute -right-1 -top-16 z-20 p-0 m-0 bg-transparent border-none text-white hover:text-neutral-300 focus:outline-none"
              style={{ boxShadow: "none" }}
              aria-label="Sluiten"
            >
              <X className="w-9 h-9" />
            </button>

            {Array.isArray(zoomImage.src) ? (
              <ImageCarousel images={zoomImage.src.map(src => ({ src, alt: zoomImage.alt }))} className="h-full" />
            ) : (
              <div
                ref={zoomViewportRef}
                className={`hide-scrollbar h-full w-full overflow-hidden flex items-center justify-center ${zoomScale > 1 ? (isPanning ? "cursor-grabbing" : "cursor-grab") : "cursor-default"}`}
                onWheel={handleZoomWheel}
                onMouseDown={handlePanStart}
                onMouseMove={handlePanMove}
                onMouseUp={handlePanEnd}
                onMouseLeave={handlePanEnd}
              >
                <img
                  ref={zoomImageRef}
                  src={zoomImage.src}
                  alt={zoomImage.alt}
                  className="project-image-quality block max-w-full max-h-full w-auto h-auto object-contain select-none"
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                    transformOrigin: "center center",
                    transition: isPanning ? "none" : "transform 120ms ease-out",
                  }}
                  draggable={false}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
