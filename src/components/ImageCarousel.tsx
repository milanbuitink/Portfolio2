import * as React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import OptimizedImage from "./OptimizedImage";
import { getBlurPlaceholder } from "@/lib/blur-utils";

interface ImageCarouselProps {
  images: { src: string; alt: string; caption?: string }[];
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, className }) => {
  if (!images || images.length === 0) {
    return null;
  }

  const [api, setApi] = React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const update = () => {
      setCurrentIndex(api.selectedScrollSnap());
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

  return (
    <div className={`w-full ${className ?? ""}`.trim()}>
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="aspect-[16/9] w-full overflow-hidden">
                <OptimizedImage
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  blurDataURL={getBlurPlaceholder(image.src)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>

      {currentCaption ? (
        <p className="mt-4 text-lg md:text-xl font-light leading-relaxed text-muted-foreground">
          {currentCaption}
        </p>
      ) : null}
    </div>
  );
};

export default ImageCarousel;

