import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { getProjectBySlug, getAdjacentProjects } from "@/data/projects";
import Header from "@/components/Header";
import OptimizedImage from "@/components/OptimizedImage";
import ImageCarousel from "@/components/ImageCarousel";
import { getBlurPlaceholder } from "@/lib/blur-utils";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const MOLENHOF_MOBILE_IMAGES = {
  begane: new URL("../../images/molenhof/begane-mobile.webp", import.meta.url).href,
  eerste: new URL("../../images/molenhof/eerste-mobile.webp", import.meta.url).href,
  gevels: new URL("../../images/molenhof/gevels-mobile.webp", import.meta.url).href,
  doorsnedes: new URL("../../images/molenhof/doorsnedes-mobile.webp", import.meta.url).href,
  fragment1: new URL("../../images/molenhof/fragment1-mobile.webp", import.meta.url).href,
  fragment2: new URL("../../images/molenhof/fragment2-mobile.webp", import.meta.url).href,
};

const getMobileOptimizedMolenhofSrc = (src: string, isMobile: boolean, slug: string) => {
  if (!isMobile || slug !== "nieuwe molenhof") return src;
  if (src.includes("doorsnedes")) return MOLENHOF_MOBILE_IMAGES.doorsnedes;
  if (src.includes("fragment1")) return MOLENHOF_MOBILE_IMAGES.fragment1;
  if (src.includes("fragment2")) return MOLENHOF_MOBILE_IMAGES.fragment2;
  if (src.includes("gevels")) return MOLENHOF_MOBILE_IMAGES.gevels;
  if (src.includes("eerste")) return MOLENHOF_MOBILE_IMAGES.eerste;
  if (src.includes("begane")) return MOLENHOF_MOBILE_IMAGES.begane;
  return src;
};

type ZoomImageState = { src: string | string[]; alt: string };

const computeSafeMaxZoom = (naturalWidth: number, naturalHeight: number) => {
  const longestSide = Math.max(naturalWidth, naturalHeight);

  if (longestSide >= 13000) return 2;
  if (longestSide >= 9000) return 2.5;
  return 4;
};

const DesktopZoomModal = ({
  zoomImage,
  onClose,
}: {
  zoomImage: ZoomImageState;
  onClose: () => void;
}) => {
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [maxZoomScale, setMaxZoomScale] = useState(4);
  const zoomViewportRef = useRef<HTMLDivElement | null>(null);
  const zoomImageRef = useRef<HTMLImageElement | null>(null);
  const panStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

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
      const nextScale = Math.min(Math.max(delta < 0 ? currentScale + 0.12 : currentScale - 0.12, 1), maxZoomScale);
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

  const handleZoomImageLoaded = () => {
    const image = zoomImageRef.current;
    if (!image || !image.naturalWidth || !image.naturalHeight) return;

    const nextMax = computeSafeMaxZoom(image.naturalWidth, image.naturalHeight);
    setMaxZoomScale(nextMax);
    setZoomScale((currentScale) => Math.min(currentScale, nextMax));
    setPanOffset((currentPan) => clampPan(currentPan.x, currentPan.y, Math.min(zoomScale, nextMax)));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const preventBrowserZoom = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };

    const preventGestureZoom = (event: Event) => {
      event.preventDefault();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", preventBrowserZoom, { passive: false });
    window.addEventListener("gesturestart", preventGestureZoom, { passive: false });
    window.addEventListener("gesturechange", preventGestureZoom, { passive: false });
    window.addEventListener("gestureend", preventGestureZoom, { passive: false });

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", preventBrowserZoom);
      window.removeEventListener("gesturestart", preventGestureZoom);
      window.removeEventListener("gesturechange", preventGestureZoom);
      window.removeEventListener("gestureend", preventGestureZoom);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] hidden md:flex items-center justify-center bg-black/70 p-6" onClick={onClose}>
      <div
        className="relative w-full max-w-[1200px] h-[85vh] bg-transparent overflow-visible"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
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
              onLoad={handleZoomImageLoaded}
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
  );
};

const Project = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const { prev, next } = slug ? getAdjacentProjects(slug) : { prev: null, next: null };
  const [zoomImage, setZoomImage] = useState<ZoomImageState | null>(null);

  const isDesktopViewport = () => window.matchMedia("(min-width: 768px)").matches;

  const openZoom = (src: string | string[], alt: string) => {
    if (!isDesktopViewport()) return;
    setZoomImage({ src, alt });
  };

  const closeZoom = () => {
    setZoomImage(null);
  };

  useEffect(() => {
    // Scroll naar top bij pagina wissel
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">Project niet gevonden</h1>
          <Link
            to="/project"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Terug naar projecten
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
  const heroUsesContainFit = project.slug === "sloterdijk";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-32">
        <section className="max-w-6xl mx-auto px-6 md:px-8 mb-8">
          <Link
            to="/project"
            className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Terug naar projecten
          </Link>
        </section>

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
              className={`project-image-quality w-full h-full ${heroUsesContainFit ? "object-contain" : "object-cover"}`}
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
              <div className="space-y-2 text-[0.81rem] md:text-[0.9rem] font-light leading-relaxed text-muted-foreground">
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
                    className="text-[0.81rem] md:text-[0.9rem] font-light leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Image Gallery */}
        <section className="px-4 md:px-8 lg:px-16 space-y-7 md:space-y-14">
          {(() => {
            const galleryImages = project.images.slice(1);

            const galleryItems = galleryImages.flatMap((image, imageIndex) => {
              const firstImageSrc = Array.isArray(image.src) ? image.src[0] : image.src;
              const isMolenhofRendersInData =
                project.slug === "nieuwe molenhof" &&
                Array.isArray(image.src) &&
                image.src.length === 7 &&
                typeof firstImageSrc === "string" &&
                firstImageSrc.includes("molenhof/render1");
              const isMolenhofSequenceInData =
                Array.isArray(image.src) &&
                image.src.length >= 17 &&
                typeof firstImageSrc === "string" &&
                firstImageSrc.toLowerCase().includes("molenhof");
              const isMolenhofDSequenceInData =
                Array.isArray(image.src) &&
                typeof firstImageSrc === "string" &&
                firstImageSrc.includes("molenhof/d");
              const isMolenhofASequenceInData =
                Array.isArray(image.src) &&
                typeof firstImageSrc === "string" &&
                firstImageSrc.toLowerCase().includes("molenhof/a1");
              const isTimberTunesCarouselGroup =
                project.slug === "Timbertunes" &&
                Array.isArray(image.src) &&
                typeof firstImageSrc === "string" &&
                (firstImageSrc.includes("ttklimaatz") || firstImageSrc.includes("detail1"));

              if (
                isMobile &&
                Array.isArray(image.src) &&
                project.slug !== "nieuwe molenhof" &&
                !isTimberTunesCarouselGroup &&
                !isMolenhofSequenceInData &&
                !isMolenhofRendersInData &&
                !isMolenhofDSequenceInData &&
                !isMolenhofASequenceInData
              ) {
                return image.src.map((src, slideIndex) => ({
                  ...image,
                  src,
                  caption: image.captions?.[slideIndex] ?? image.caption,
                  __key: `${imageIndex}-${slideIndex}`,
                  __fromCarousel: true,
                }));
              }

              return [
                {
                  ...image,
                  __key: `${imageIndex}`,
                  __fromCarousel: false,
                },
              ];
            });

            return galleryItems.map((image, index) => {
            const isZoomable = Boolean(image.zoomable && !Array.isArray(image.src));
            const isCarousel = Array.isArray(image.src);
            const frameClassName = `project-image-frame relative w-full ${isCarousel ? "" : "overflow-hidden"} ${isZoomable ? "cursor-pointer" : ""}`.trim();
            const firstSrc = Array.isArray(image.src) ? image.src[0] : image.src;
            const isSloterdijkFragment =
              project.slug === "sloterdijk" &&
              typeof firstSrc === "string" &&
              firstSrc.includes("fragment");
            const isSloterdijkKlimaat =
              project.slug === "sloterdijk" &&
              typeof firstSrc === "string" &&
              firstSrc.includes("klimaat");
            const isSloterdijkDiagram =
              typeof firstSrc === "string" &&
              (firstSrc.includes("dwellingtypes") || firstSrc.includes("principles"));
            const isGevelfragment = typeof firstSrc === "string" && firstSrc.includes("gevelfragment");
            const isKrachtschema = typeof firstSrc === "string" && firstSrc.includes("krachtschema");
            const isKlimaatSchema = typeof firstSrc === "string" && (firstSrc.includes("ttklimaatz") || firstSrc.includes("ttklimaatw"));
            const isBeganeEerste = typeof firstSrc === "string" && (firstSrc.includes("ttbegane") || firstSrc.includes("tteerste"));
            const isPublic123 =
              project.slug === "natural-elements" &&
              typeof firstSrc === "string" &&
              (firstSrc.includes("public/1") || firstSrc.includes("/public/1") || firstSrc.includes("/1.webp") || firstSrc.includes("/1"));
            const isPublicDefSection =
              project.slug === "natural-elements" &&
              typeof firstSrc === "string" &&
              (firstSrc.includes("public/def1") || firstSrc.includes("public/def2") || firstSrc.includes("public/section") || firstSrc.includes("def1") || firstSrc.includes("def2") || firstSrc.includes("section"));
            const isPublicDiagram =
              project.slug === "natural-elements" &&
              typeof firstSrc === "string" &&
              (firstSrc.includes("public/diagram") || firstSrc.includes("/diagram") || firstSrc.includes("diagram"));
            const isPublicPoster =
              project.slug === "natural-elements" &&
              typeof firstSrc === "string" &&
              firstSrc.includes("public/poster");
            const isMolenhofSequence =
              Array.isArray(image.src) &&
              image.src.length >= 17 &&
              typeof firstSrc === "string" &&
              firstSrc.toLowerCase().includes("molenhof");
            const isMolenhofASequence =
              Array.isArray(image.src) &&
              image.src.length === 4 &&
              typeof firstSrc === "string" &&
              firstSrc.toLowerCase().includes("molenhof/a1");
            const isMolenhofRenders =
              project.slug === "nieuwe molenhof" &&
              Array.isArray(image.src) &&
              image.src.length === 7 &&
              typeof firstSrc === "string" &&
              firstSrc.includes("molenhof/render1");
            const isMolenhofDSequence =
              Array.isArray(image.src) &&
              typeof firstSrc === "string" &&
              firstSrc.includes("molenhof/d");
            const isMolenhofSwipeCarousel = isMolenhofSequence || isMolenhofASequence || isMolenhofRenders;
            const isDetails = typeof firstSrc === "string" && (firstSrc.includes("detail1") || firstSrc.includes("detail2") || firstSrc.includes("detail3"));
            const isRenders = typeof firstSrc === "string" && (firstSrc.includes("render1") || firstSrc.includes("render2") || firstSrc.includes("render3") || firstSrc.includes("render4") || firstSrc.includes("render5"));
            const isMolenhofLargeImage =
              project.slug === "nieuwe molenhof" &&
              typeof firstSrc === "string" &&
              (firstSrc.includes("begane") ||
                firstSrc.includes("eerste") ||
                firstSrc.includes("gevels") ||
                firstSrc.includes("doorsnedes") ||
                firstSrc.includes("fragment1") ||
                firstSrc.includes("fragment2"));

            const prev = index > 0 ? galleryItems[index - 1] : undefined;
            const prevFirstSrc = prev
              ? (Array.isArray(prev.src) ? prev.src[0] : prev.src)
              : undefined;
            const prevIsKlimaatSchema = typeof prevFirstSrc === "string" && (prevFirstSrc.includes("ttklimaatz") || prevFirstSrc.includes("ttklimaatw"));
            const prevIsDetails = typeof prevFirstSrc === "string" && (prevFirstSrc.includes("detail1") || prevFirstSrc.includes("detail2") || prevFirstSrc.includes("detail3"));

            const extraTopSpaceClassName = (isGevelfragment && prevIsKlimaatSchema) || (isKrachtschema && prevIsDetails)
              ? "pt-4 md:pt-8"
              : "";

            const isExpandedCarouselSlide = isMobile && (image as { __fromCarousel?: boolean }).__fromCarousel;

            const shouldMobileZoomToFill =
              isMobile &&
              typeof firstSrc === "string" &&
              (firstSrc.includes("ttbegane") || firstSrc.includes("tteerste") || firstSrc.includes("gevelfragment"));

            const outerClassName = isExpandedCarouselSlide
              ? "w-full"
              : isMolenhofRenders
                ? "w-[85%] md:w-[85%] md:mx-auto"
              : isMolenhofDSequence
                ? "w-full md:w-[85%] md:mx-auto"
              : isMolenhofSequence || isMolenhofASequence
                ? "w-full md:w-[70%] md:mx-auto"
              : isPublicPoster
                ? "w-[85%] md:w-[30%] mx-auto"
              : isPublic123 || isPublicDefSection
                ? "w-full md:w-[75%] md:mx-auto"
                : isPublicDiagram
                  ? "w-full md:w-[56%] md:mx-auto"
                  : isSloterdijkFragment
                ? "w-full md:w-1/2 md:mx-auto"
                : isSloterdijkDiagram
                  ? "w-full md:w-1/2 md:mx-auto"
                  : isSloterdijkKlimaat
                    ? "w-full md:w-1/2 md:mx-auto"
                : isGevelfragment
                ? (isMobile ? "w-full" : "w-4/5 mx-auto")
                : isKrachtschema
                  ? "w-[85%] md:w-[45%] mx-auto"
                  : isKlimaatSchema
                    ? "w-[85%] mx-auto"
                    : isBeganeEerste
                      ? "w-full md:w-[85%] md:mx-auto"
                      : isDetails
                        ? (project.slug === "Timbertunes" && isMobile ? "w-full" : "w-[85%] mx-auto")
                        : isRenders
                          ? "w-[85%] mx-auto"
                          : image.width === "half"
                            ? "w-full md:w-1/2 md:mx-auto"
                            : "w-full";

            const wrapperClassName = `${outerClassName} ${extraTopSpaceClassName}`.trim();
            const mobileMolenhofSpacingClassName = isMolenhofLargeImage ? "py-4" : "";
            const wrapperClassWithSpacing = `${wrapperClassName} ${mobileMolenhofSpacingClassName}`.trim();

            return (
              <div key={(image as { __key?: string }).__key ?? index} className={wrapperClassWithSpacing}>
                {(() => {
                  const renderedImageSrc = !Array.isArray(image.src)
                    ? getMobileOptimizedMolenhofSrc(image.src, isMobile, project.slug)
                    : image.src;

                  return (
                <div
                  className={frameClassName}
                  onClick={isZoomable ? () => openZoom(image.src as string, image.alt) : undefined}
                >
                  {Array.isArray(renderedImageSrc) ? (
                    (() => {
                      if (isMobile && isMolenhofRenders) {
                        return (
                          <div className="flex flex-col gap-4 items-center">
                            {renderedImageSrc.map((src, slideIndex) => (
                              <div
                                key={src}
                                className="aspect-[16/9] w-full overflow-hidden bg-background flex items-center justify-center"
                              >
                                <OptimizedImage
                                  src={src}
                                  alt={`${image.alt} ${slideIndex + 1}`}
                                  containerClassName="w-full h-full"
                                  className="w-full h-full object-contain"
                                  blurDataURL={getBlurPlaceholder(src)}
                                  draggable={false}
                                />
                              </div>
                            ))}
                          </div>
                        );
                      }

                      const sloterdijkCarouselIsSmaller =
                        project.slug === "sloterdijk" &&
                        typeof firstSrc === "string" &&
                        (
                          firstSrc.includes("begane") ||
                          firstSrc.includes("/25") ||
                          firstSrc.includes("/68") ||
                          firstSrc.includes("/911") ||
                          firstSrc.includes("gallery") ||
                          firstSrc.includes("corridor") ||
                          firstSrc.includes("maisonette") ||
                          firstSrc.includes("detail") ||
                          firstSrc.includes("voor") ||
                          firstSrc.includes("achter") ||
                          firstSrc.includes("puntdak") ||
                          firstSrc.includes("totaalmodel") ||
                          firstSrc.includes("fragmentmodel")
                        );
                      const sloterdijkCarouselUsesOutsideArrows = project.slug === "sloterdijk";
                      const thesisCarouselIsSmaller = project.slug === "MSc4";

                      return (
                    <ImageCarousel
                      images={renderedImageSrc.map((src, slideIndex) => ({
                        src,
                        alt: image.alt,
                        caption: image.captions?.[slideIndex] ?? image.caption,
                      }))}
                      className={
                        sloterdijkCarouselIsSmaller || thesisCarouselIsSmaller
                          ? thesisCarouselIsSmaller
                            ? "md:w-[85%] md:mx-auto"
                            : "md:w-[70%] md:mx-auto"
                          : undefined
                      }
                      showCaptions={thesisCarouselIsSmaller ? false : !isRenders}
                      tightFooter={isKlimaatSchema}
                      arrowsOutside={sloterdijkCarouselUsesOutsideArrows || isKlimaatSchema || isRenders}
                      slideAspectClassName={isKlimaatSchema ? "aspect-[3/1]" : undefined}
                      hideArrowsOnMobile={isMolenhofSwipeCarousel}
                      compactPagination={isMolenhofSwipeCarousel}
                      hidePagination={thesisCarouselIsSmaller}
                    />
                      );
                    })()
                  ) : (
                    <OptimizedImage
                      src={renderedImageSrc}
                      alt={image.alt}
                      className={
                        isExpandedCarouselSlide
                          ? (
                              shouldMobileZoomToFill
                                ? "project-image-quality w-full h-auto object-contain origin-center scale-[1.6]"
                                : "project-image-quality w-full h-auto object-contain"
                            )
                          : (
                              shouldMobileZoomToFill
                                ? "project-image-quality w-full h-auto object-cover origin-center scale-[1.25]"
                                : "project-image-quality w-full h-auto object-cover"
                            )
                      }
                      blurDataURL={getBlurPlaceholder(renderedImageSrc as string)}
                    />
                  )}
                </div>
                  );
                })()}

                {(() => {
                  if (Array.isArray(image.src)) return null;

                  if (isExpandedCarouselSlide) {
                    if (isRenders) return null;
                    if (!image.caption) return null;
                    return (
                      <p className="mt-2 text-center text-[0.81rem] md:text-[0.9rem] font-light leading-relaxed text-muted-foreground">
                        {image.caption}
                      </p>
                    );
                  }

                  if (!image.caption) return null;
                  return (
                    <p className="mt-4 text-[0.81rem] md:text-[0.9rem] font-light leading-relaxed text-muted-foreground">
                      {image.caption}
                    </p>
                  );
                })()}
              </div>
            );
            });
          })()}
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
      {zoomImage && <DesktopZoomModal zoomImage={zoomImage} onClose={closeZoom} />}
    </div>
  );
};

export default Project;
