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
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  className,
  showCaptions = true,
  tightFooter = false,
  arrowsOutside = false,
  slideAspectClassName,
}) => {
  if (!images || images.length === 0) {
    return null;
  }

  const [api, setApi] = React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [slideCount, setSlideCount] = React.useState(images.length);

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

  return (
    <div className={`w-full ${className ?? ""}`.trim()}>
      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
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
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="ghost"
          className={
            arrowsOutside
              ? "absolute -left-8 md:-left-12 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-none border-0 bg-transparent shadow-none text-foreground/80 hover:text-foreground hover:bg-transparent"
              : "absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-none border-0 bg-transparent shadow-none text-foreground/80 hover:text-foreground hover:bg-transparent"
          }
        />
        <CarouselNext
          variant="ghost"
          className={
            arrowsOutside
              ? "absolute -right-8 md:-right-12 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-none border-0 bg-transparent shadow-none text-foreground/80 hover:text-foreground hover:bg-transparent"
              : "absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-none border-0 bg-transparent shadow-none text-foreground/80 hover:text-foreground hover:bg-transparent"
          }
        />
      </Carousel>

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

      <div
        className={tightFooter ? "mt-0 flex items-center justify-center gap-2" : "mt-3 flex items-center justify-center gap-2"}
        aria-label="Carousel pagination"
      >
        {Array.from({ length: slideCount }).map((_, dotIndex) => {
          const isActive = dotIndex === currentIndex;
          return (
            <span
              key={dotIndex}
              className={
                isActive
                  ? "h-2.5 w-2.5 rounded-full bg-muted-foreground"
                  : "h-2 w-2 rounded-full bg-muted-foreground/30"
              }
              aria-hidden="true"
            />
          );
        })}
      </div>
    </div>
  );
};

export default ImageCarousel;

