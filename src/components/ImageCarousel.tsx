import * as React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import OptimizedImage from "./OptimizedImage";
import { getBlurPlaceholder } from "@/lib/blur-utils";

interface ImageCarouselProps {
  images: { src: string; alt: string; caption?: string }[];
  className?: string;
  showCaptions?: boolean;
  tightFooter?: boolean;
  arrowsOutside?: boolean;
  slideAspectClassName?: string;
  hideArrowsOnMobile?: boolean;
  mobileSwipeHint?: string;
  hidePagination?: boolean;
  compactPagination?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  className,
  showCaptions = true,
  tightFooter = false,
  arrowsOutside = false,
  slideAspectClassName,
  hideArrowsOnMobile = true,
  mobileSwipeHint,
  hidePagination = false,
  compactPagination = true,
}) => {
  // Enforce site-wide behavior: always hide arrows on mobile and always use compact (max 5) pagination
  const effectiveHideArrowsOnMobile = true;
  const effectiveCompactPagination = true;
  if (!images || images.length === 0) {
    return null;
  }

  const [api, setApi] = React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [slideCount, setSlideCount] = React.useState(images.length);
  const [paginationWindowStart, setPaginationWindowStart] = React.useState(0);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    let isActive = true;
    setIsReady(false);

    const preloadImages = async () => {
      await Promise.all(
        images.map(
          (image) =>
            new Promise<void>((resolve) => {
              const preload = new window.Image();

              preload.onload = () => resolve();
              preload.onerror = () => resolve();
              preload.src = image.src;

              if (preload.complete && preload.naturalWidth > 0) {
                resolve();
              }
            })
        )
      );

      if (isActive) {
        setIsReady(true);
      }
    };

    void preloadImages();

    return () => {
      isActive = false;
    };
  }, [images]);

  React.useEffect(() => {
    if (!api) return;

    const update = () => {
      setCurrentIndex(api.selectedScrollSnap());
      setSlideCount(api.scrollSnapList().length);
    };

    update();
    api.on("select", update);
    api.on("reInit", update);

    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  const currentCaption = images[currentIndex]?.caption;
  const slidePaddingClass = tightFooter ? "py-0" : "py-8 md:py-12";
  const aspectClass = slideAspectClassName ?? "aspect-[16/9]";

  React.useEffect(() => {
    if (!effectiveCompactPagination || slideCount <= 5) {
      setPaginationWindowStart(0);
      return;
    }

    const maxStart = slideCount - 5;
    setPaginationWindowStart((previousStart) => {
      let nextStart = Math.min(previousStart, maxStart);

      // Keep the active slide inside a soft center zone (slots 1..3)
      // so the indicator moves naturally before the window shifts.
      if (currentIndex <= nextStart + 1) {
        nextStart = Math.max(0, currentIndex - 1);
      } else if (currentIndex >= nextStart + 3) {
        nextStart = Math.min(maxStart, currentIndex - 3);
      }

      return nextStart;
    });
  }, [effectiveCompactPagination, currentIndex, slideCount]);

  const paginationIndexes = React.useMemo(() => {
    if (!effectiveCompactPagination || slideCount <= 5) {
      return Array.from({ length: slideCount }, (_, index) => index);
    }

    return [
      paginationWindowStart,
      paginationWindowStart + 1,
      paginationWindowStart + 2,
      paginationWindowStart + 3,
      paginationWindowStart + 4,
    ];
  }, [effectiveCompactPagination, paginationWindowStart, slideCount]);

  return (
    <div className={`w-full ${className ?? ""}`.trim()}>
      {isReady ? (
        <Carousel
          setApi={setApi}
          className={`w-full ${arrowsOutside ? "md:px-14" : ""}`.trim()}
          opts={{ loop: true, dragFree: false }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className={`${aspectClass} w-full overflow-hidden bg-background flex items-center justify-center ${slidePaddingClass}`}>
                  <OptimizedImage
                    src={image.src}
                    alt={image.alt}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-contain"
                    blurDataURL={getBlurPlaceholder(image.src)}
                    draggable={false}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="ghost"
            className={
              [
                arrowsOutside
                  ? "absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-none border-0 bg-transparent shadow-none text-foreground/80 hover:text-foreground hover:bg-transparent"
                  : "absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-none border-0 bg-transparent shadow-none text-foreground/80 hover:text-foreground hover:bg-transparent",
                effectiveHideArrowsOnMobile ? "hidden md:flex" : "flex",
              ].join(" ")
            }
          />
          <CarouselNext
            variant="ghost"
            className={
              [
                arrowsOutside
                  ? "absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-none border-0 bg-transparent shadow-none text-foreground/80 hover:text-foreground hover:bg-transparent"
                  : "absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-none border-0 bg-transparent shadow-none text-foreground/80 hover:text-foreground hover:bg-transparent",
                effectiveHideArrowsOnMobile ? "hidden md:flex" : "flex",
              ].join(" ")
            }
          />
        </Carousel>
      ) : (
        <div className={`${aspectClass} w-full overflow-hidden bg-muted/30`} />
      )}

      {mobileSwipeHint ? (
        <div className="mt-2 flex items-center justify-center gap-2 text-muted-foreground motion-safe:animate-subtle-blink motion-reduce:animate-none md:hidden">
          <span className="text-xs font-light tracking-widest">{mobileSwipeHint}</span>
        </div>
      ) : null}

      {showCaptions && currentCaption ? (
        <p
          className={
            tightFooter
              ? "mt-0 text-center text-[0.81rem] md:text-[0.9rem] font-light leading-relaxed text-muted-foreground"
              : "mt-4 text-center text-[0.81rem] md:text-[0.9rem] font-light leading-relaxed text-muted-foreground"
          }
        >
          {currentCaption}
        </p>
      ) : null}

      {!hidePagination ? (
        <div
          className={tightFooter ? "mt-0 flex items-center justify-center gap-2" : "mt-3 flex items-center justify-center gap-2"}
          aria-label="Carousel pagination"
        >
          {paginationIndexes.map((dotIndex, slotIndex) => {
            const distanceFromActive = Math.abs(dotIndex - currentIndex);
            return (
              <span
                key={effectiveCompactPagination && slideCount > 5 ? slotIndex : dotIndex}
                className={
                  distanceFromActive === 0
                    ? "h-1.5 w-1.5 rounded-full bg-neutral-600 scale-100 transition-all duration-200"
                    : distanceFromActive === 1
                      ? "h-1.5 w-1.5 rounded-full bg-neutral-500/75 scale-90 transition-all duration-200"
                      : "h-1.5 w-1.5 rounded-full bg-neutral-400/45 scale-75 transition-all duration-200"
                }
                aria-hidden="true"
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ImageCarousel;

